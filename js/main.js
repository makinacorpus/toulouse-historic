// Add Base Layer
var toulouse1680Url = 'http://{s}.livembtiles.makina-corpus.net/makina/toulouse1680/{z}/{x}/{y}.png';
var toulouse1830Url = 'http://{s}.livembtiles.makina-corpus.net/makina/toulouse1830/{z}/{x}/{y}.png';
var toulouse2013Url = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
var toulouse1680 = L.tileLayer(toulouse1680Url, {minZoom: 15, maxZoom: 20, subDomains: 'abcdefgh'});
var toulouse1830 = L.tileLayer(toulouse1830Url, {minZoom: 15, maxZoom: 20, subDomains: 'abcdefgh'});
var subDomains = ['otile1','otile2','otile3','otile4'];
var toulouse2013 = L.tileLayer(toulouse2013Url, {minZoom: 15, maxZoom: 20, 
            subdomains: ["otile1", "otile2", "otile3", "otile4"]})

var map = L.map('map', { zoomControl:false, attributionControl:false, maxBounds: [[43.5874,1.4179],[43.6156,1.4629]]});
map.setView([43.6, 1.44], 16);

var baseMaps = {
    "1680": toulouse1680,
    "1830": toulouse1830,
    "2013": toulouse2013
};

toulouse2013.addTo(map);


$("input[name='basemapLayers']").change(function () {
    // Remove unchecked layers
    $("input:radio[name='basemapLayers']:not(:checked)").each(function () {
        map.removeLayer(window[$(this).attr("id")]);
    });
    // Add checked layer
    $("input:radio[name='basemapLayers']:checked").each(function () {
        map.addLayer(window[$(this).attr("id")]);
    });
});

var historicalMonuments = L.geoJson(null, {
    style: function (feature) {
        return {
            color: "black"
        };
    },
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            title: feature.properties.name,
            riseOnHover: true
        });
    },
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            var content =   "<h4>" + feature.properties.name + "</h4>"+
                            "<a href='http://www.culture.gouv.fr/public/mistral/merimee_fr?ACTION=CHERCHER&FIELD_1=REF&VALUE_1="+feature.properties['ref:mhs']+"'' target='_blank'>Plus de détails</a>"
                            ;
            layer.bindPopup(content, {
                maxWidth: "auto",
                closeButton: false
            });
        }
    }
});
$.getJSON("data/historicalMonuments.geojson", function (data) {
    historicalMonuments.addData(data);
});

var canal = L.geoJson(null, {
    style: function (feature) {
        return {
            color: "black"
        };
    },
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            title: feature.properties.equipement,
            riseOnHover: true
        });
    },
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            var content =   "<h4>" + feature.properties.equipement + "</h4>";
            layer.bindPopup(content, {
                maxWidth: "auto",
                closeButton: false
            });
        }
    }
});
$.getJSON("data/canal_equipements.geojson", function (data) {
    canal.addData(data);
});

$("input:checkbox[name='overlayLayers']").change(function () {
    var layers = [];
    if ($("#" + $(this).attr("id")).is(":checked")) {
        $("input:checkbox[name='overlayLayers']").each(function () {
            // Remove all overlay layers
            map.removeLayer(window[$(this).attr("id")]);
            if ($("#" + $(this).attr("id")).is(":checked")) {
                // Add checked layers to array for sorting
                layers.push({
                    "layer": $(this)
                });
            }
        });
        $.each(layers, function () {
            map.addLayer(window[$(this)[0].layer[0].id]);
        });
    } else {
        // Simply remove unchecked layers
        map.removeLayer(window[$(this).attr("id")]);
    }
});

map.addLayer(historicalMonuments);
