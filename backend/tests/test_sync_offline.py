"""Synchronization regressions using synthetic responses only."""
import importlib.util
from pathlib import Path
import sys
import unittest
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import requests
import sync


class SyncTests(unittest.TestCase):
    def test_http_error_is_rejected_before_workbook_parsing(self):
        response = Mock()
        response.raise_for_status.side_effect = requests.HTTPError("synthetic HTTP failure")
        with patch.object(sync.requests, "get", return_value=response), patch.object(sync.pd, "ExcelFile") as excel:
            with self.assertRaises(requests.HTTPError):
                sync.parse_imovel("synthetic", "https://example.invalid/sheet?format=xlsx")
        excel.assert_not_called()

    def test_request_has_finite_connect_and_read_timeout(self):
        with patch.object(sync.requests, "get", side_effect=requests.Timeout("synthetic timeout")) as get:
            with self.assertRaises(requests.Timeout):
                sync.parse_imovel("synthetic", "https://example.invalid/sheet?format=xlsx")
        timeout = get.call_args.kwargs.get("timeout")
        self.assertIsNotNone(timeout)
        for value in timeout if isinstance(timeout, tuple) else (timeout,):
            self.assertGreater(value, 0)
            self.assertLessEqual(value, 60)

    def test_importing_manual_probe_does_not_access_network(self):
        path = Path(__file__).resolve().parents[1] / "test_sync.py"
        spec = importlib.util.spec_from_file_location("manual_probe", path)
        module = importlib.util.module_from_spec(spec)
        with patch("requests.get") as get:
            spec.loader.exec_module(module)
        get.assert_not_called()

    def test_supported_date_formats(self):
        for value in ("2026-11-04", "04/11/26", "2026/11/04", "04/11/2026"):
            with self.subTest(value=value):
                self.assertEqual(sync.normalize_data(value), "04/11/2026")
        self.assertEqual(sync.normalize_data("data desconhecida"), "data desconhecida")


if __name__ == "__main__":
    unittest.main()
