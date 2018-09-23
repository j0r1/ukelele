
var g_lessons = [ ];
var g_interval = 5;
var g_show = true;

function onCSVLoaded(data)
{
    console.log("Loaded data:");
    console.log(data);

    CSV.fetch({"data":data}).done(function(dataset) {
        var records = dataset["records"];

        var activeChords = null;

        for (var i = 0 ; i < records.length ; i++)
        {
            if (records[i][0].length > 0) // New lesson name
            {
                activeChords = [ ]
                g_lessons.push({ "name": records[i][0], "chords": activeChords });
            }

            if (records[i][1].length > 0) // New chord
            {
                var layout = [ ];
                var chord = { "name": records[i][1], "layout": layout };
                for (var j = 2 ; j < 6 ; j++)
                {
                    var x = JSON.parse("[" + records[i][j] + "]");
                    if (x.length == 0)
                        layout.push(null);
                    else if (x.length == 2)
                        layout.push(x);
                }

                activeChords.push(chord);
            }
        }
        console.log("Parsed data:");
        console.log(g_lessons);
        
        $("#startbutton").show();
    });
}

function drawChord(chord)
{
    var maxPos = 3;
    var name = chord["name"];
    var layout = chord["layout"];

    $("#chordname").text(name);

    for (var i = 0 ; i < layout.length ; i++)
    {
        if (layout[i] !== null)
        {
            var pos = layout[i][1];
            if (pos > maxPos)
                maxPos = pos;
        }
    }
    console.log(chord);
    var posh = 140;
    var posw = 100;
    var rad = posw/4;
    var buffer = rad+2;
    var totalh = buffer + maxPos*posh + buffer;
    var totalw = buffer + 3*posw + buffer;

    $("#drawarea").empty();
    var draw = SVG('drawarea').size(totalw, totalh);

    draw.line(buffer,buffer,totalw-buffer,buffer).stroke({"width": 2});
    draw.line(buffer,buffer+6,totalw-buffer,buffer+6).stroke({"width": 2});

    draw.line(buffer,buffer,buffer,totalh-buffer).stroke({"width": 2});
    draw.line(buffer+posw,buffer,buffer+posw,totalh-buffer).stroke({"width": 2});
    draw.line(buffer+posw*2,buffer,buffer+posw*2,totalh-buffer).stroke({"width": 2});
    draw.line(buffer+posw*3,buffer,buffer+posw*3,totalh-buffer).stroke({"width": 2});

    for (var i = 0 ; i < maxPos ; i++)
    {
        var h = buffer+(i+1)*posh;
        draw.line(buffer,h,totalw-buffer,h).stroke({"width": 2});
    }

    for (var i = 0 ; i < layout.length ; i++)
    {
        if (layout[3-i] !== null)
        {
            var finger = layout[3-i][0];
            var pos = layout[3-i][1]-1;

            draw.circle(rad*2).move(buffer+i*posw-rad, buffer+(pos+0.5)*posh-rad).stroke({"width": 2}).attr({ "fill": "#fff" });
            var t = draw.text("" + finger);
            t.font({"family": "Helvetica", "size": rad, "anchor": "middle"});
            var l = t.length();

            t.move(buffer+i*posw, buffer+(pos+0.5)*posh-rad/2);
        }
    } 
}

function start()
{
    var allchords = [ ];
    var interval = 5000;

    for (var l = 0 ; l < g_lessons.length ; l++)
    {
        for (var c = 0 ; c < g_lessons[l]["chords"].length ; c++)
            allchords.push(g_lessons[l]["chords"][c]);
    }

    var f = function()
    {
        var idx = Math.floor(Math.random()*allchords.length);

        drawChord(allchords[idx]);
    }

    f();

    setInterval(function() {
        f();
    }, interval);
}

function main()
{
    var docId = "1Xc8wihS8F9OUhtwhFlQadq7l3MdllZZmNQMScfH9Kgs";
    var sheetId = "Sheet1";
    var url = "https://docs.google.com/spreadsheets/d/" + docId + "/gviz/tq?tqx=out:csv&sheet=" + sheetId;

    $.get(url).done(onCSVLoaded).fail(function(e) {
        alert("Unable to load document " + docId); 
        console.log("Unable to load document");
        console.log(e);
    });
}
