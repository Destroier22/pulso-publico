import json
import unittest
from pathlib import Path

DATA = Path(__file__).resolve().parents[2] / "data" / "snapshot.json"


class SnapshotQualityTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.payload = json.loads(DATA.read_text(encoding="utf-8"))

    def test_expected_scope(self):
        self.assertEqual(len(self.payload["cities"]), 15)

    def test_unique_ibge_codes(self):
        codes = [row["ibgeCode"] for row in self.payload["cities"]]
        self.assertEqual(len(codes), len(set(codes)))

    def test_shares_are_valid(self):
        for row in self.payload["cities"]:
            self.assertGreater(row["expensePerCapita"], 0)
            self.assertTrue(0 <= row["healthShare"] <= 100)
            self.assertTrue(0 <= row["educationShare"] <= 100)


if __name__ == "__main__":
    unittest.main()
