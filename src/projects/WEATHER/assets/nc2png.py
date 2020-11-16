from PyQt5.QtCore import QTimer
import processing

variables = [
  "IEA_CDD18monthly",
  "IEA_CDDhum18monthly",
  "IEA_Cloudmonthly",
  "IEA_Daylightmonthly",
  "IEA_DNImonthly",
  "IEA_Evaporationmonthly",
  "IEA_GHImonthly",
  "IEA_HDD18monthly",
  "IEA_HeatIndexmonthly",
  "IEA_Humidexmonthly",
  "IEA_Precipitationmonthly",
  "IEA_RHmonhly",
  "IEA_Runoffmonthly",
  "IEA_Snowfallmonthly",
  "IEA_Temperaturemaxmonthly",
  "IEA_Temperatureminmonthly",
  "IEA_Temperaturemonthly",
  "IEA_Wind10intmonthly",
  "IEA_Wind100intmonthly"
  "IEA_Wind100powermonthly"
]

test = [
  "CDD18",
  "CDDhum18",
  "Cloud",
  "Daylight",
  "DNI",
  "Evaporation",
  "GHI",
  "HDD18",
  "HeatIndex",
  "Humidex",
  "Precipitation",
  "RH",
  "Runoff",
  "Snowfall",
  "Temperaturemax",
  "Temperaturemin",
  "Temperature",
  "Wind10int",
  "Wind100int",
  "Wind100power",
]

print("IEA_"+test[0]+"monthly")

color = {
  "default": ["#ffffcc", "#e3c7a7", "#ce9c8b", "#c77165", "#c1463f", "#b60000"],
  "CDD": ["#008712", "#61ac1b", "#cac522", "#e7d939", "#dd9328", "#b93326"],
  "HDD": ["#ffffe0", "#ccd7d0", "#9eb3c2", "#698ab1", "#3561a1", "#003790"],
  "Wind": ["#ffffff", "#d9d9d9", "#b5b5b5", "#8a8a8a", "#606060", "#393939"],
  "Snow": ["#ddbd79", "#e3ca92","#ead6ac","#f1e3c7","#f7efdf","#f0f0f0"],
  "Daylight": ["#424139","#676647","#878653","#aaa961","#cdcc6e","#fcfc80"],
  "Precipitation": ["#ffffff","#cedbcd","#a4bca2","#759a73","#477744","#165312"],
  "Humidity": ["#ffe470","#c9c077","#9ba17d","#6b8083","#3d6189","#003790"]
}

colors = {
  "IEA_HDD18monthly": color["HDD"],
  "IEA_Precipitationmonthly": color["Precipitation"],
  "IEA_Snowfallmonthly": color["Snow"],
  "IEA_Cloudmonthly": color["Snow"],
  "IEA_Evaporationmonthly": color["Snow"],
  "IEA_Wind10intmonthly": color["Wind"],
  "IEA_Wind100intmonthly": color["Wind"],
  "IEA_CDDhum18monthly": color["CDD"],
  "IEA_CDD18monthly": color["CDD"],
  "IEA_Daylightmonthly": color["Daylight"],
  "IEA_DNImonthly": color["default"],
  "IEA_GHImonthly": color["default"],
  "IEA_Runoffmonthly": color["default"],
  "IEA_Temperatureminmonthly": color["default"],

  "IEA_Temperaturemaxmonthly": color["default"],
  "IEA_Temperaturemonthly": color["default"],
}

url = "/Users/wonjiky/Documents/IEA/@Weather/source/qgis/variables/"
pngurl = "/Users/wonjiky/Documents/IEA/ieavisualisations/public/weather/grid/"

prj = QgsProject.instance()
grid_layers = [layer for layer in prj.mapLayers().values()]
crsSrc = QgsCoordinateReferenceSystem("EPSG:4326")
crsDest = QgsCoordinateReferenceSystem("EPSG:3857")
te = '-20037508.3427892439067364,20037508.3427892550826073,-20037508.3427892439067364,20037508.3427892439067364'

count = 0
months = 1
currMonth = 1
currYear = 2017

# Create color list based on value range
def getColors(currColor, maxvalue):
  color_items = []
  for idx, color in enumerate(currColor):
    interval = (maxvalue / (len(currColor) - 1)) * idx
    color_items.append(QgsColorRampShader.ColorRampItem(interval, QColor(color)))
  return color_items


def addNewLayers():
  global currYear
  global currMonth
  currMonth += 1
  
  if currMonth < 10: month = '0' + str(currMonth)
  else: month = str(currMonth)

  for variable in variables:
    layerurl = url + str(currYear) + '/' + month + '/' + variable + "_" + str(currYear) + "_" + month + '.nc'
    layer = QgsRasterLayer(layerurl, variable)

    processing.runAndLoadResults("gdal:warpreproject", {
      'INPUT': layer,
      'SOURCE_CRS' : crsSrc, 
      'TARGET_CRS' : crsDest, 
      'TARGET_EXTENT' : te,
      'TARGET_EXTENT_CRS' : crsDest, 
      'OUTPUT': 'TEMPORARY_OUTPUT'
    })

    layerList = prj.layerTreeRoot().findLayers()
    layerName = layerList[0].name()
    layerList[0].setName(layerName.replace("Reprojected", variable))
  
  repaintLayers()


def repaintLayers():
  layers = [layer for layer in prj.mapLayers().values()]
  
  for layer in layers:
    provider = layer.dataProvider()
    extent = layer.extent()

    ver = provider.hasStatistics(1, QgsRasterBandStats.All)
    stats = provider.bandStatistics(1, QgsRasterBandStats.All,extent, 0)
    layername = layer.name()

    # Set min value to 0 if min value is smaller than 0
    if (stats.minimumValue < 0): min = 0
    else: min = stats.minimumValue
    maxvalue = stats.maximumValue
    # Set new color band with new colors
    fcn = QgsColorRampShader()
    fcn.setColorRampType(QgsColorRampShader.Interpolated)
    fcn.setColorRampItemList(getColors(colors[layername], maxvalue))
    shader = QgsRasterShader()
    shader.setRasterShaderFunction(fcn)
    single_band_pseudo_color = QgsSingleBandPseudoColorRenderer(layer.dataProvider(), 1, shader)

    # Render with new band
    layer.setRenderer(single_band_pseudo_color)
    layer.triggerRepaint()  
  
  prepareMap()


def prepareMap(): # Arrange layers
  grid_layers = [layer for layer in prj.mapLayers().values()]
  iface.actionHideAllLayers().trigger() # make all layers invisible
  prj.layerTreeRoot().findLayer(grid_layers[count].id()).setItemVisibilityCheckedParentRecursive(True)
  QTimer.singleShot(1000, exportMap) # Wait a second and export the map


def exportMap(): 
  if currMonth < 10: month = '0' + str(currMonth)
  else: month = str(currMonth)
  grid_layers = [layer for layer in prj.mapLayers().values()]
  global count 
  render(count)
  print(count,"---", currYear, '/', month, variables[count]," EXPORTED")
  if count < len(grid_layers) - 1:
    QTimer.singleShot(1000, prepareMap) # Wait a second and prepare next map
    count += 1
  else: 
    prj.removeAllMapLayers()
    print("--------- " + month + " RENDERING COMPLETE ---------")
    if currMonth < months:
      count = 0
      addNewLayers()
    else: print("--------- RENDERING COMPLETE ---------")
  


def render(count):
  if currMonth < 10: month = '0' + str(currMonth)
  else: month = str(currMonth)
  grid_layers = [layer for layer in prj.mapLayers().values()]
  imagelocation = pngurl + str(currYear) + "/" + month + "/" + grid_layers[count].name() + ".png"
  result = grid_layers[count]
  settings = QgsMapSettings()
  settings.setLayers([result])
  settings.setOutputSize(QSize(720, 720))
  settings.setExtent(result.extent())
  render = QgsMapRendererParallelJob(settings)

  def finished():
    img = render.renderedImage()
    img.save(imagelocation, "png")

  render.finished.connect(finished)
  render.start()


# addNewLayers()
