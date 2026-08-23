"""Generate Google Scholar JSON used by the homepage's live citation badges.

The output format follows the MIT-licensed crawler pattern used by
diaoquesang/diaoquesang.github.io, with a newer Scholarly release and a
separate, repository-local implementation.
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path

from scholarly import scholarly


def main() -> None:
    scholar_id = os.environ["GOOGLE_SCHOLAR_ID"]
    output_dir = Path(os.environ.get("SCHOLAR_OUTPUT_DIR", "scholar-stats"))

    author = scholarly.search_author_id(scholar_id)
    scholarly.fill(author, sections=["basics", "indices", "counts", "publications"])
    author["updated"] = datetime.now(timezone.utc).isoformat()
    author["publications"] = {
        publication["author_pub_id"]: publication for publication in author["publications"]
    }

    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "gs_data.json").write_text(
        json.dumps(author, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (output_dir / "gs_data_shieldsio.json").write_text(
        json.dumps(
            {
                "schemaVersion": 1,
                "label": "citations",
                "message": str(author.get("citedby", 0)),
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
