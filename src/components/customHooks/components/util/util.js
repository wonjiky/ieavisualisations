export const lineDashArray = [
  "step", ["zoom"],
  ["literal", [3.25, 3.25]], 6, ["literal", [2.5, 2.5]], 7, ["literal", [2, 2.25]], 8, ["literal", [1.75, 2]]
]; 


export const oecd = {
  sources: [
    {
      id: 'shapes',
      url: 'mapbox://iea.2y7t2nbd'
    },
    {
      id: 'solid',
      url: 'mapbox://iea.5n5i3sum'
    }
  ],
  layers: [
    {
      id: 'shapes',
      source: 'shapes',
      sourceLayer: 'countries_shape-d9t091',
      layout: { visibility: 'visible' },
      paint: {}
    },
    {
      id: 'solid',
      source: 'solid',
      sourceLayer: 'countries_border-blqedw',
      layout: { visibility: 'visible' },
      filter: [
        "all",
        [
          "match",
          ["get", "line_type"],
          ["", "Solid"],
          true,
          false
        ]
      ],
      paint: {}
    },
    {
      id: 'dotted',
      source: 'solid',
      sourceLayer: 'countries_border-blqedw',
      layout: { visibility: 'visible' },
      filter: [
        "all",
        [
          "match",
          ["get", "line_type"],
          ["", "dotted"],
          true,
          false
        ]
      ],
      paint: {
        'line-dasharray': [
          "step", ["zoom"],
          ["literal", [3.25, 3.25]], 6, ["literal", [2.5, 2.5]], 7, ["literal", [2, 2.25]], 8, ["literal", [1.75, 2]]
        ]
      }
    }
  ]
};

export const centroids = {
  sources: {
    id: 'centroids',
    url: 'mapbox://iea.4ci5bfkj',
  },
  layers: {
    id: 'centroids-layer',
    source: 'centroids',
    sourceLayer: "countries_centroids-5ecuvr",
    layout: { visibility: 'visible' }
  }
}

export const mapBox = {
  sources: [
    {
      id: 'solid',
      url: 'mapbox://mapbox.mapbox-streets-v8',
    },
    {
      id: 'dotted',
      url: 'mapbox://iea.a4n5445m'
    }
  ],
  layers: [
    {
      id: 'solid',
      source: 'solid-borders',
      sourceLayer: 'admin',
      layout: { visibility: 'visible' },
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
    },
    {
      id: 'dotted',
      source:'solid-borders',
      sourceLayer: 'admin',
      layout: { visibility: 'visible' },
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
        ],
      ],
    },
    {
      id: 'dotted',
      source:'solid-borders',
      sourceLayer: 'admin',
      layout: { visibility: 'visible' },
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
      ],
    },
    {
      id: 'dotted',
      source: 'dotted-borders',
      sourceLayer: 'dottedborder_1-a7o3op',
      layout: { visibility: 'visible' },
      filter: [
        "match",
        ["get", "OBJECTID"],
        [127],
        true,
        false
      ]
    }
  ]
}
