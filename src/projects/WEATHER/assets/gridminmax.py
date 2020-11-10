from netCDF4 import Dataset
import matplotlib.pyplot as plt
import json
import numpy as np

minYear = 2010
maxYear = 2019
yearRange = maxYear - minYear + 1
monthRange = 12

result = {}
baseurl = '/Users/wonjiky/Documents/IEA/@Weather/source/qgis/variables/'

variables = {
  "IEA_CDD18monthly": "dd",
  "IEA_CDDhum18monthly": "dd",
  "IEA_Cloudmonthly": "tcc",
  "IEA_Daylightmonthly": "dl",
  "IEA_DNImonthly": "fdir",
  "IEA_Evaporationmonthly": "e",
  "IEA_GHImonthly": "ssrd",
  "IEA_HDD18monthly": "dd",
  "IEA_Precipitationmonthly": "tp",
  "IEA_Runoffmonthly": "ro",
  "IEA_Snowfallmonthly": "sf",
  "IEA_Temperaturemaxmonthly": "t2m",
  "IEA_Temperatureminmonthly": "t2m",
  "IEA_Temperaturemonthly": "t2m",
  "IEA_Wind10intmonthly": "wind",
  "IEA_Wind100intmonthly": "wind"
}

varkey = [values for values in variables]

for v in varkey:
  result[str(v)] = []
  for y in range(yearRange):
    result[v].append([])
    for m in range(monthRange):
      result[v][y].append([])


def loopYear():
  for y in range(yearRange):
    year = str(minYear + y) 
    loopMonth(year)


def loopMonth(year):
  for m in range(monthRange):
    loopVariables(year, m)


def loopVariables(year, month):
  
  if month < 9: monthStr = '0' + str(month + 1)
  else: monthStr = str(month + 1)
  currYear = int(year) - minYear
  tempMonthArray = []

  for variable in varkey:
    url = baseurl + year + "/" + monthStr + "/" + variable + "_" + year + "_" + monthStr + ".nc"
    data = Dataset(url)
    raw_value = data.variables[variables[variable]][:]

    for values in raw_value:
      for value in values:
        tempMonthArray.append(value)

    print(year, monthStr, variable, '--------', [min(tempMonthArray), max(tempMonthArray)])
    result[variable][currYear][month].append([min(tempMonthArray), max(tempMonthArray)])
    tempMonthArray.clear()
    data.close()


def exportCsv(data):
  print(data)
  with open('2018.json', 'w', encoding='utf-8') as f:
    json.dump(str(data), f, indent=4)

loopYear()
exportCsv(result)
