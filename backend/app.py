from flask import Flask, Response
import sqlite3
import json

app = Flask(__name__)

DB_LOCATION = "poi.sqlite"

@app.route('/poi')
def poi_to_map():
    db = sqlite3.connect(DB_LOCATION)
    db.row_factory = sqlite3.Row
    cursor = db.execute("SELECT * FROM df_csv")
    poi = cursor.fetchall()
    cursor.close()
    db.close()

    geojson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [row['lat'], row['lon']]
                },
                "properties": dict(row)
            }
            for row in poi
        ]
    }

    r = Response(
        json.dumps(geojson, ensure_ascii=False),
        mimetype="application/json",
        headers={"Access-Control-Allow-Origin": "*"}
    )
    return r