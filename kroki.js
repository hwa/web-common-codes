//<script src="vendor/pako_deflate.min.js"></script>
function replace_ascii_with_svg () {
    var USE_LOCAL = false;
    var kroki_site = USE_LOCAL && 'kroki/' || 'http://kroki.io/';
    var output_format = svg_as_image_support() && 'svg' || 'png';
    var code_list = document.querySelectorAll('code');
    var onload = function(i){return function(){console.log(i);};};
    for (var i=0; i<code_list.length; i++){
        var el = code_list[i];
        var diagramSource = el.textContent;
        var el_class = el.getAttribute('class');
        if (el_class && el_class.match(/^ditaa$/)){
            var source_hash = encode_source(diagramSource);
            if (USE_LOCAL) {source_hash = source_hash.substr(0,240);}
            var div = document.createElement('div');
            var img = document.createElement('img');
            img.setAttribute('id', i);
            img.setAttribute('alt', 'description');
            div.appendChild(img);
            img.addEventListener('load', function(){
                var j = parseInt(this.getAttribute('id'));;
                var pre = code_list[j].parentNode;
                pre.parentNode.replaceChild(this.parentNode, pre);
            });
            img.setAttribute('src', kroki_site + el_class + '/' + output_format +
                             '/'  + source_hash + (USE_LOCAL && '.svg' || ''));
        }
    }
}

function encode_source (diagramSource){
    var data = new TextEncoder('utf-8').encode(diagramSource);
    var compressed = pako.deflate(data, { level: 9, to: 'string' });
    var result = btoa(compressed)
                 .replace(/\+/g, '-').replace(/\//g, '_');
    return result;
}

function svg_as_image_support (){
    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
}

replace_ascii_with_svg(); //progresively replace
