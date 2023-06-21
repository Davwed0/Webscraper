import requests
import pandas as pd
import datetime

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)


@app.route("/")
def home():
    return "heellooo"


# Define a route to provide data to the frontend
@app.route("/api/data")
def get_data():
    data = {
        "query": "\n query getTransactionDeveloper(\n $dateSold: [String],\n $developer: [String],\n $limit: Int,\n $page: Int,\n $phaseName: String,\n $sort: [SORT],\n $subDistrict: [String],\n $transactionSource: TransactionSource,\n ) {\n transactionDeveloper(\n dateSold: $dateSold,\n developer: $developer,\n limit: $limit,\n page: $page,\n phaseName: $phaseName,\n sort: $sort,\n subDistrict: $subDistrict,\n transactionSource: $transactionSource,\n ) {\n currentPage\n items {\n block {\n blockChineseName\n }\n dateSold\n flat {\n flatName\n flatSaleableArea\n }\n floor {\n floorName\n }\n phase {\n phaseChineseName\n }\n phaseId\n priceList\n project {\n projectDistrict {\n subDistrict\n }\n }\n saleablePrice\n saleablePriceLandreg\n sellPrice\n sellPriceLandreg\n transactionRemark\n }\n totalRecords\n }\n }\n    ",
        "variables": {
            "page": 0,
            "limit": 10000,
            "phaseName": "University Hill",
            "transactionSource": "DEVELOPER",
        },
    }

    response = requests.post(
        "https://ps.hket.com/internal-apisix/hket-property-prod/graphql", json=data
    )
    lenQuery = response.json()["data"]["transactionDeveloper"]["totalRecords"]
    response = response.json()

    df = pd.json_normalize(response["data"]["transactionDeveloper"]["items"])
    df = df.loc[
        :,
        [
            "dateSold",
            "phase.phaseChineseName",
            "block.blockChineseName",
            "floor.floorName",
            "flat.flatName",
            "sellPrice",
            "flat.flatSaleableArea",
            "saleablePrice",
        ],
    ]
    df["index_col"] = df.index
    df["dateSold"] = pd.to_datetime(df["dateSold"]).dt.strftime("%Y/%m/%d")
    df["sellPrice"] = (df["sellPrice"] / 10000).apply(
        lambda x: "售 ${:,} 萬".format(round(x))
    )
    df["flat.flatSaleableArea"] = df["flat.flatSaleableArea"].astype(str) + " 呎"
    df["saleablePrice"] = (df["saleablePrice"]).apply(lambda x: "${:,.0f}/呎".format(x))

    df = df.rename(
        columns={
            "index_col": "id",
            "dateSold": "transactionTime",
            "phase.phaseChineseName": "propertyName",
            "block.blockChineseName": "tower",
            "floor.floorName": "floor",
            "flat.flatName": "unit",
            "sellPrice": "transactionAmount",
            "flat.flatSaleableArea": "saleableArea",
            "saleablePrice": "unitPrice",
        },
    )

    return df.to_json(orient="records", force_ascii=False)
