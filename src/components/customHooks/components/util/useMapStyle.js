export const dottedBorderA = {
    filter: [
        "all",
        [
          "==",
          ["get", "disputed"],
          "true"
        ],
        [
          "==",
          ["get", "admin_level"],
          0
        ],
        [
          "==",
          ["get", "maritime"],
          "false"
        ],
        [
          "match",
          ["get", "worldview"],
          ["all", "US"],
          true,
          false
        ],
        [
          "match",
          ["get", "iso_3166_1"],
          ["D0CNIN0-dispute"],
          true,
          false
        ]
    ],
    lineDashArray: [
        "step",
        ["zoom"],
        ["literal", [3.25, 3.25]],
        6,
        ["literal", [2.5, 2.5]],
        7,
        ["literal", [2, 2.25]],
        8,
        ["literal", [1.75, 2]]
    ]   
};

export const solidBorder = {
    filter: [
        "any",
        [
          "all",
          [
            "==",
            ["get", "admin_level"],
            0
          ],
          [
            "==",
            ["get", "disputed"],
            "false"
          ],
          [
            "==",
            ["get", "maritime"],
            "false"
          ],
          [
            "match",
            ["get", "worldview"],
            ["all", "CN"],
            true,
            false
          ],
          [
            "match",
            ["get", "iso_3166_1"],
            ["all", "CN"],
            false,
            true
          ]
        ],
        [
          "all",
          [
            "match",
            ["get", "disputed"],
            ["true", "false"],
            true,
            false
          ],
          [
            "==",
            ["get", "admin_level"],
            0
          ],
          [
            "==",
            ["get", "maritime"],
            "false"
          ],
          [
            "match",
            ["get", "worldview"],
            ["US", "IN"],
            true,
            false
          ],
          [
            "match",
            ["get", "iso_3166_1"],
            ["D0CNIN2-dispute"],
            true,
            false
          ]
        ],
        [
          "all",
          [
            "==",
            ["get", "disputed"],
            "true"
          ],
          [
            "==",
            ["get", "admin_level"],
            0
          ],
          [
            "==",
            ["get", "maritime"],
            "false"
          ],
          [
            "match",
            ["get", "worldview"],
            [
              "CN",
              "all",
              "IN",
              "US"
            ],
            true,
            false
          ],
          [
            "match",
            ["get", "iso_3166_1"],
            ["EH-MA-dispute"],
            true,
            false
          ]
        ]
      ]
};

export const dottedBorderB = {
    filter: [
        "any",
        [
          "all",
          [
            "==",
            ["get", "admin_level"],
            0
          ],
          [
            "==",
            ["get", "maritime"],
            "false"
          ],
          [
            "match",
            ["get", "worldview"],
            ["JP"],
            true,
            false
          ],
          [
            "match",
            ["get", "disputed"],
            ["true"],
            true,
            false
          ],
          [
            "match",
            ["get", "iso_3166_1"],
            ["CN-IN-dispute"],
            true,
            false
          ]
        ],
        [
          "all",
          [
            "==",
            ["get", "disputed"],
            "true"
          ],
          [
            "==",
            ["get", "admin_level"],
            0
          ],
          [
            "==",
            ["get", "maritime"],
            "false"
          ],
          [
            "match",
            ["get", "worldview"],
            ["all", "US"],
            true,
            false
          ],
          [
            "match",
            ["get", "iso_3166_1"],
            [
              "D0INPK1-dispute",
              "IN-PK-dispute",
              "D0INPK2-dispute"
            ],
            true,
            false
          ]
        ],
        [
          "all",
          [
            "==",
            ["get", "disputed"],
            "true"
          ],
          [
            "==",
            ["get", "admin_level"],
            0
          ],
          [
            "==",
            ["get", "maritime"],
            "false"
          ],
          [
            "match",
            ["get", "worldview"],
            ["CN", "all"],
            true,
            false
          ],
          [
            "match",
            ["get", "iso_3166_1"],
            [
              "D0SDSS1-dispute",
              "SD-SS-dispute",
              "EG-SD-dispute",
              "D0EGSD1-dispute",
              "D0EGSD2-dispute"
            ],
            true,
            false
          ]
        ],
        [
          "all",
          [
            "==",
            ["get", "disputed"],
            "true"
          ],
          [
            "==",
            ["get", "admin_level"],
            0
          ],
          [
            "==",
            ["get", "maritime"],
            "false"
          ],
          [
            "match",
            ["get", "worldview"],
            ["all", "CN"],
            true,
            false
          ],
          [
            "match",
            ["get", "iso_3166_1"],
            [
              "IL-SY-dispute",
              "D0ILSY1-dispute",
              "IL-PS-dispute"
            ],
            true,
            false
          ]
        ]
      ]
}