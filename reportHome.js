/* 
#**********************************************Program Signature**************************************************
# Program Name:Annotation.js Version:0.0.23 [Creation Date: 12-Nov-2018 Last Modified Date: 26-Apr-2019] 
# Author:Inamul Hassan & Mohamed Abbas & Abinesh Shankar | Full Stack Developer|SurfaceInsight Technologies Private Limited
# Modified: Sathya & Pagu|Directors|SurfaceInsight Technologies Private Limited
# Program Description: Intention of this program is Annotate images which is being captured by the user.
# Tech-stack:Node(version:10.13.0),NPM (Version:6.4.1), Electron 
# Dependencies       : 4 external
# No.of.Methods      : 
# No.of.Lines Of Code: 1888
#-------------------------------------Method and it's details listed below--------------------------------------
# 01) electron       : Base package for Electron application
# 02) events         : Javascript File System(FS) it access the local file system.
# 03) log4js         : logger for Javascript.
#**********************************************Start of Program**************************************************
*/

const {
    ipcRenderer,
    remote
} = require('electron');
var $ = jQuery = require('jquery');
var log4js = require('log4js');
const Store = require('electron-store');
const store = new Store();
var currentTaxonomy = []
var config = require('../properties/config.properties')
const fancytree = require('jquery.fancytree');
require('jquery.fancytree/dist/modules/jquery.fancytree.edit');
require('jquery.fancytree/dist/modules/jquery.fancytree.filter');
var pdfview = require('../assets/js/elpdfview');
var $ = require('jquery');
var dt = require('datatables.net')();
require('datatables.net-bs4')();
require('datatables.net-buttons-bs4')();
require('datatables.net-buttons/js/buttons.colVis.js')();
require('datatables.net-colreorder-bs4')();
// require( 'datatables.net-responsive-bs4' )();
require('datatables.net-scroller-bs4')();
require('datatables.net-select-bs4')();
var copydir = require('copy-dir');
var rimraf = require("rimraf");
const saveSvgAsPng = require('save-svg-as-png');
// var domtoimage = require('dom-to-image-more');
/* Global Declaration. */
var jsonString;
var l5Count = 0;
var l6Count = 0,
    globalFirstL5, tableData = "",
    globalL5name;
var temp_l3;
var templ4;
var templ5;
var templ6;
var level = 0
var l6_with_name = {}
var imageWithID = {}
var fs = require('fs');
var metadata = {}
var level = 0
var filterarchive = []

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#Close').addEventListener('click', windowClose),
        document.querySelector('#Minimize').addEventListener('click', windowMinimize),
        document.querySelector('#Help').addEventListener('click', Help)
    document.querySelector("#swimtopng").addEventListener("click", saveImage)
});

$(document).ready(function() {
    TaxonomyFile = store.get(localStorage.getItem("TaxonomyName"))
    TaxonomyProcessDetails = store.get("Toxonomy_Index")
    if (TaxonomyProcessDetails != undefined) {
        TaxonomyProcessDetails.forEach(element => {
            if (element[0] == localStorage.getItem("TaxonomyName")) {
                currentTaxonomy = element
            }
        });
        TreeJSONcreater(TaxonomyFile)
            // Get the element with id="defaultOpen" and click on it
        document.getElementById("default").click();
        $("#backHome").click(function() {
            $("#rightTable,#selectDownloadTable").show()
        })
        $("#selectDownloadTable").change(function() {

            if (this.value == "PDF") {
                conversion({ html: ' <table id="dataTable" style="margin-top: 42px;" class="table table-striped table-bordered" >' + document.getElementById("dataTable").innerHTML + "</table>" }, function(err, pdf) {
                    if (fs.existsSync(config.screenshotFolderLocation + "intellicatpure_" + localStorage.getItem("TaxonomyName") + ".pdf"))
                        fs.unlinkSync(config.screenshotFolderLocation + "intellicatpure_" + localStorage.getItem("TaxonomyName") + ".pdf")
                    var output = fs.createWriteStream(config.screenshotFolderLocation + "intellicatpure_" + localStorage.getItem("TaxonomyName") + ".pdf")
                    pdf.stream.pipe(output);
                });
            }
            // since pdf.stream is a node.js stream you can use it
            // to save the pdf to a file (like in this example) or to
            // respond an http request.
            else if (this.value == "Image(PNG)") {
                domtoimage.toPng(document.getElementById("dataTable"), {
                        quality: 1,
                        style: {
                            backgroundColor: "white",
                        },
                    })
                    .then(function(dataUrl) {
                        var link = document.createElement('a');
                        link.download = localStorage.getItem("TaxonomyName") + "_table.png";
                        link.href = dataUrl;
                        link.click();
                    });
            }
        })


    } else {
        popmsg("please upload Taxonomy Setup.")
    }
})

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function TreeJSONcreater(Toxonomy_File) {
    // var loc = String('C:\\SurfaceAI\\Custody & Fund Services\\Domestic Setup\\Account Opening\\werwerq')
    // locationpushtorest(loc, 'dummy');

    var id1 = 1,
        count = 0
    var root = new Object();
    root.id = id1;
    root.nodeType = "HEllo"
    id1 = id1 + 1;
    root.title = "Taxonomy Structure";
    root.folder = true
    root.expanded = true
        //-------------------------------------------ROOT---------------------------------------------//
    root.children = [];
    temp_l3 = root.children
    var iteml3 = {},
        l3 = []
    for (var i = 1; i < Toxonomy_File.length; i++) {
        if (Toxonomy_File[i][6] != undefined) {
            l3.push(Toxonomy_File[i][3])
        }
    }

    l3 = l3.filter(onlyUnique);
    l3.forEach(elementl3 => {
        iteml3["id"] = id1
        iteml3["title"] = elementl3
        iteml3["folder"] = true
        iteml3["expanded"] = true
        id1 = id1 + 1
        temp_l3.push(iteml3)
            //        console.log(temp_l1)
            //////////////////////// L2
        var l4 = []
        for (var i = 1; i < Toxonomy_File.length; i++) {
            if (Toxonomy_File[i][3] == elementl3) {
                if (Toxonomy_File[i][6] != undefined)
                    l4.push(Toxonomy_File[i][4])
            }
        }
        iteml3.children = []
        templ4 = iteml3.children;
        l4 = l4.filter(onlyUnique)
        var iteml4 = {}
        l4.forEach(elementl4 => {
            iteml4["id"] = id1
            iteml4["title"] = elementl4
            iteml4["folder"] = true
            iteml4["expanded"] = true
            id1 = id1 + 1;
            templ4.push(iteml4)

            l5 = []
            for (var i = 1; i < Toxonomy_File.length; i++) {
                var flagStatus = false
                if (Toxonomy_File[i][4] == elementl4) {
                    if (Toxonomy_File[i][6] != undefined) {
                        if (Toxonomy_File[i][12] != undefined) {
                            for (var iter = 0; iter < Toxonomy_File[i][12].length; iter++) {
                                console.log(Toxonomy_File[i][12][iter])
                                if (Toxonomy_File[i][12][iter] != null) {
                                    if (Toxonomy_File[i][12][iter][1] == false)
                                        flagStatus = true
                                } else
                                    flagStatus = true
                            }
                        } else {
                            flagStatus = true
                        }
                        if (flagStatus == true) {
                            l5.push(Toxonomy_File[i][5])
                            console.log(Toxonomy_File[i][5])
                        }
                    }
                }
            }

            iteml4.children = []
            templ5 = iteml4.children
            l5 = l5.filter(onlyUnique)
            var iteml5 = {}

            l5.forEach(elementl5 => {
                if (count == 0) {
                    globalFirstL5 = id1
                    console.log(globalFirstL5)
                }
                count++
                iteml5["id"] = id1
                iteml5["title"] = elementl5
                iteml5["folder"] = true
                id1 = id1 + 1
                templ5.push(iteml5)

                var l6 = []
                var activityPaths = []
                for (var i = 1; i < Toxonomy_File.length; i++) {
                    if (Toxonomy_File[i][5] == elementl5) {
                        if (Toxonomy_File[i][6] != undefined) {
                            Toxonomy_File[i][6].forEach(e => {
                                var l6FlagStatus = false
                                try {
                                    if (Toxonomy_File[i][12][Toxonomy_File[i][6].indexOf(e)][1] == true)
                                        l6FlagStatus = true
                                    console.log(Toxonomy_File[i][12][Toxonomy_File[i][6].indexOf(e)][1], e)
                                } catch (err) {
                                    l6FlagStatus = false;
                                }
                                if (l6FlagStatus == false) {
                                    console.log(e)
                                    l6.push(e)
                                    index = Toxonomy_File[i][6].indexOf(e)
                                    if (e.length > 21) {
                                        text = e.substring(0, 21) + '...'
                                    } else {
                                        text = e
                                    }
                                    l6_with_name[text] = e
                                    activityPaths.push(Toxonomy_File[i][8][index])
                                }
                            })
                        }
                    }
                }
                console.log(l6)
                l6Count += l6.length
                iteml5.children = []
                templ6 = iteml5.children
                l6 = l6.filter(onlyUnique)
                var iteml6 = {},
                    counter = 0
                l6.forEach(elementl6 => {
                    iteml6["id"] = id1
                    if (elementl6.length > 21) {
                        text = elementl6.substring(0, 21) + '...'
                    } else {
                        text = elementl6
                    }
                    iteml6["title"] = text
                    iteml6["value"] = activityPaths[counter]
                    id1 = id1 + 1
                    templ6.push(iteml6)
                    iteml6 = {}
                    counter++
                })
                iteml5 = {}
            })
            iteml4 = {}
        })
        iteml3 = {}
    })
    jsonString = root;
    //console.log(l4)
    GenerateTree(jsonString)
}

function getalldata(type) {
    var data = JSON.stringify("");
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function() {
        if (this.readyState === 4) {
            data = JSON.parse(this.responseText)
            if (type != 'tbldatavalue') {
                main(document.getElementById('diagram'), data)

            }
        }
    });

    xhr.open("POST", "http://127.0.0.1:5000/SurfaceAI/Activity/getRecordingData/");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("Postman-Token", "caa1db2d-844f-4dbd-b9a4-7f98a01d4b38");

    xhr.send(data);
}

function updatearchivexml() {
    var request = require("request");
    var options = {
        method: 'POST',
        url: 'http://localhost:5000/SurfaceAI/Activity/updateRecordingInfo/',
        headers: {
            'Postman-Token': '8be77a28-d999-48cf-a104-896848857ca3',
            'cache-control': 'no-cache',
            'Content-Type': 'application/json'
        },
        body: { './Recording_Header': { Recording_Archived: 'Yes' } },
        json: true
    };

    request(options, function(error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });
}

function GenerateTree(jsonString) {
    $(function() {
        $("#leftlist").fancytree({
            clickFolderMode: 4,
            icon: true,
            tooltip: false,
            quicksearch: true,
            extensions: ["filter"],
            //checkbox: true,
            selectMode: 1,
            source: [jsonString],
            filter: {
                autoApply: true, // Re-apply last filter if lazy data is loaded
                autoExpand: false, // Expand all branches that contain matches while filtered
                counter: true, // Show a badge with number of matching child nodes near parent icons
                fuzzy: false, // Match single characters in order, e.g. 'fb' will match 'FooBar'
                hideExpandedCounter: true, // Hide counter badge if parent is expanded
                hideExpanders: false, // Hide expanders if all child nodes are hidden by filter
                highlight: true, // Highlight matches by wrapping inside <mark> tags
                leavesOnly: false, // Match end nodes only
                nodata: true, // Display a 'no data' status node if result is empty
                mode: "dimm" // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
            },
            init: function(event, data, flag) {
                data.tree.rootNode.setActive()
                console.log(data.tree.rootNode)
                $("#leftlist").fancytree("getTree").activateKey('1');
                var tree = $("#leftlist").fancytree("getTree");
                var d = tree.toDict(true);
                if (globalFirstL5 != undefined) {
                    console.log(globalFirstL5, "--------------------------------------")
                    console.log(tree)
                    try {
                        tree.activateKey('_' + globalFirstL5).focusOnSelect = true;
                    } catch (err) {
                        tree.activateKey('_1').focusOnSelect = true;
                    }
                    hierarchy()
                }
            },
            keyboard: true,
            autoActivate: true,
            titlesTabbable: true,
            activate: function(event, data) {
                if (data.node.getLevel() == 4) {
                    globalFirstL5 = data.node.data.id
                    globalL5name = data.node.title
                    createTable(data.node.getChildren())
                }
                if (data.node.getLevel() == 1) {
                    hierarchy()
                }
                if (data.node.getLevel() > 1) {
                    levels(data.node.getLevel(), data.node.title)
                }
                if (data.node.getLevel() == 3) {
                    TaxonomyFile = store.get(localStorage.getItem("TaxonomyName"))
                        //hierarchy(TaxonomyFile)
                }
                if (data.node.data.value != undefined) {
                    $("#diagram").html("")
                    localStorage.setItem("currentlySelectedPath", data.node.data.value)
                    var path = data.node.data.value
                    localStorage.setItem("reportName", (path.split("\\")[path.split("\\").length - 1]))
                    $('#diagram').attr("style", 'max-width: 78%; max-height: 85.5%;min-width: 75%; min-height: 70%;');
                    locationpushtorest(data.node.data.value, "dummy")
                        //$("#statusLine").text(data.node.title+"End");
                }
            },
        })
    });

}







function createTable(records) {
    var TaxonomyFile = store.get(localStorage.getItem("TaxonomyName")),
        RecordRow = [],
        tableStructure = ""
        // records[0].data.value
    for (var i = 0; i < TaxonomyFile.length; i++) {
        if (TaxonomyFile[i][6] == undefined)
            continue
        console.log(TaxonomyFile[i][8].indexOf(records[0].data.value))

        try {

            if (TaxonomyFile[i][8].indexOf(records[0].data.value) > -1) {
                var rowPos = i
                RecordRow = TaxonomyFile[i]
                break
            }
        } catch (err) {

        }
    }
    tableStructure = '<table id="dataTable" style="margin-top: 42px;" class="table table-striped table-bordered" >' +
        "           <thead ><tr role='row'>" +
        "<th style=='width:130px !important' >S.No <div class='indicate'></div></th><th >Rec.Date <div class='indicate'></div></th><th>Rec.Name <div class='indicate1'></div></th><th># Steps Captured<div class='indicate'></div></th><th># Active Screens <div class='indicate'></div></th>" +
        "<th># Active Steps <div class='indicate'></div></th><th>Technology <div class='indicate'></div></th><th>AHT(Derived) <div class='indicate'></div></th><th>AHT(User entered) <div class='indicate1'></div></th>" +
        "<th>No.of fields <div class='indicate1'></div></th><th>Input type <div class='indicate1'></div></th><th>Input source <div class='indicate1'></div></th><th>FTE Count <div class='indicate1'></div></th>" +
        "<th>No.of trans/month <div class='indicate1'></div></th><th>Activity complexity <div class='indicate1'></div></th><th>Activity criticality <div class='indicate1'></div></th>" +
        "<th>Activity type <div class='indicate1'></div></th><th>STP <div class='indicate1'></div><th>Periodicity <div class='indicate1'></div><th>Duration details<div class='indicate1'></div></th><th>Frequency <div class='indicate1'></div></th><th>Workflow <div class='indicate1'></div></th><th>Sub process <div class='indicate1'></div></th><th>Process <div class='indicate1'></div></th>" +
        "<th>Function <div class='indicate1'></div></th><th>Business line <div class='indicate1'></div></th><th>Industry/Vertical <div class='indicate1'></div></th><th>Customer name <div class='indicate1'></div></th><th><img src='../assets/images/flag-white.svg' style='height:19px;margin-left: -15px;'><ext hidden>Flag</text></th>" +
        "<th id='downloadables'>Output's <div class='indicate'></div></th></tr></thead>"
    console.log(RecordRow[6])
    for (var iter = 0; iter < RecordRow[6].length; iter++) {
        // console.log(RecordRow[6])
        var AdditionInfo = ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
            src = "../assets/images/flag-teal.svg"
        if (RecordRow[10] != undefined) {
            if (RecordRow[10][iter] != undefined) {
                if (RecordRow[10][iter] != null)
                    AdditionInfo = RecordRow[10][iter]
            }
        }

        if (RecordRow[12] != undefined && RecordRow[12][iter] != undefined) {
            if (RecordRow[12][iter][1] == true) {
                // console.log(RecordRow[12][iter][1])
                continue
            }
            if (RecordRow[12][iter][0] == true)
                src = "../assets/images/flag-red.svg"
                // console.log(RecordRow[12][iter][0])
        }

        try {

            var AHTDerived = RecordRow[11][iter][3].split(":")[0] + " Hours " + RecordRow[11][iter][3].split(":")[1] + " Minutes " + RecordRow[11][iter][3].split(":")[2].substring(0, 2) + " Seconds"
            var cssBPMN, cssPDF, cssLiveVideo, path = RecordRow[8][iter]
            if (fs.existsSync(path + "\\AnnotationFlow_1.0.bpmn") && fs.existsSync(path + "\\ApplicationFlow_1.0.bpmn")) cssBPMN = "cursor:pointer"
            else cssBPMN = "cursor:not-allowed;opacity:0.5;"
            if (fs.existsSync(path + "\\" + RecordRow[6][iter] + "_1.0.pdf")) cssPDF = "cursor:pointer"
            else cssPDF = "cursor:not-allowed;opacity:0.5;"
            if (fs.existsSync(path + "\\Surface_AI_" + RecordRow[6][iter] + ".mp4")) cssLiveVideo = "cursor:pointer"
            else cssLiveVideo = "cursor:not-allowed;opacity:0.5;"
            if (fs.existsSync(path + "\\" + RecordRow[6][iter] + ".mp4")) cssAnnotVideo = "cursor:pointer"
            else cssAnnotVideo = "cursor:not-allowed;opacity:0.5; "
            tableStructure += "<tr>" +
                "<td>" + (iter + 1) + "</td>" +
                "<td >" + RecordRow[11][iter][4] + "</td>" +
                '<td onclick="viewIndividualRecordDetails(' + rowPos + ',' + iter + ')" style="cursor:pointer; color:teal;"  data-toggle="modal" data-target="#myModal"><u>' + RecordRow[6][iter] + '</u></td>' + //id= "iter'+(iter+1)+'" class="btn"
                "<td >" + RecordRow[11][iter][0] + "</td>" +
                "<td>" + RecordRow[11][iter][1] + "</td>" +
                "<td>" + RecordRow[11][iter][2] + "</td>" +
                "<td>" + RecordRow[11][iter][5] + "</td>" +
                "<td>" + AHTDerived + "</td>" +
                "<td>" + AdditionInfo[0] + "</td>" +
                "<td> - </td>" +
                "<td>" + AdditionInfo[1] + "</td>" +
                "<td>" + AdditionInfo[2] + "</td>" +
                "<td>" + AdditionInfo[3] + "</td>" +
                "<td>" + AdditionInfo[4] + "</td>" +
                "<td>" + AdditionInfo[5] + "</td>" +
                "<td>" + AdditionInfo[6] + "</td>" +
                "<td>" + AdditionInfo[7] + "</td>" +
                "<td>" + AdditionInfo[8] + "</td>" +
                "<td>" + AdditionInfo[9] + "</td>" +
                "<td>" + AdditionInfo[11] + "</td>" +
                "<td>" + AdditionInfo[12] + "</td>" +
                "<td>" + RecordRow[5] + "</td>" +
                "<td>" + RecordRow[4] + "</td>" +
                "<td>" + RecordRow[3] + "</td>" +
                "<td>" + RecordRow[2] + "</td>" +
                "<td>" + RecordRow[1] + "</td>" +
                "<td>" + RecordRow[0] + "</td>" +
                "<td> - </td>" +
                '<td ><img src=' + src + '  id="flagID' + (iter + 1) + '" onclick="archiveRecord(' + "'" + escape(RecordRow[8][iter]) + "'" + ',' + "'" + RecordRow[5] + "'" + ',' + "'" + RecordRow[6][iter] + "'" + ',' + "'" + rowPos + "'" + ',' + "'flag'" + ',' + (iter + 1) + ')"  style="height:20px;float:left; margin-top: 3.2px;cursor:pointer;"><img src="../assets/images/archival.svg" style="height:23px;float:right;    margin-top: 1.2px;cursor:pointer;" onclick="archiveRecord(' + "'" + escape(RecordRow[8][iter]) + "'" + ',' + "'" + RecordRow[5] + "'" + ',' + "'" + RecordRow[6][iter] + "'" + ',' + "'" + rowPos + "'" + ',' + "'Archive'" + ',' + (iter + 1) + ')"></td>' +
                '<td>' +
                '&emsp;<img src="../assets/Images/BPMN_Reports.svg" id="bpmnViewer' + (iter + 1) + '" style="color: black;padding: 3px;height:26px;' + cssBPMN + '" title="BPMN" alt="bpmnViewer" onclick="BPMN(' + "'" + escape(RecordRow[8][iter]) + "'" + ')">' +
                '&emsp;<img src="../assets/Images/SOP_teal.svg" id="sopViewer' + (iter + 1) + '" style="color: black;padding: 3px; height:  26px;' + cssPDF + '" alt="sopViewer" title="SOP" onclick="SOP(' + "'" + escape(RecordRow[8][iter]) + "'" + ')">' +
                '&emsp;<img src="../assets/Images/live-teal.svg" id="videoViewer' + (iter + 1) + '" title="Video" onclick="VideoAnnotation(' + "'" + escape(RecordRow[8][iter]) + "'" + ')" style="color: black;padding: 3px;' + cssLiveVideo + '" alt="videoViewer">' +
                '&emsp;<img src="../assets/Images/swimlane.svg"  style="color: black;padding: 3px;height: 26px;" alt="swimtopng" title="Swimlane" onclick="ViewSwimLane(' + "'" + escape(RecordRow[8][iter]) + "'" + ',' + iter + ')"></td>' +
                "</tr>"
            $("#rightTable").html("")
            $("#rightTable").html(tableStructure + "</table>  <span class='dot'></span><label style='margin-left: 9px;'>Engine generated</label><span class='dot1'></span><label style='    margin-left: 9px;'>User entered</label>")

        } catch (err) {

        }
    }
    $('#dataTable').DataTable({
        searching: true,
        ordering: true,
        select: true,
        paging: true,
        autoWidth: true,
        orderMulti: true,
        pageLength: 10,
        dom: 'Blfrtip',
        columnDefs: [{
                targets: 1,
                className: 'noVis',

            },
            { "visible": false, "targets": store.get(localStorage.getItem("TaxonomyName") + "_Settings") }
        ],
        buttons: [
            'colvis',
            {
                extend: 'pdfHtml5',
                title: function() {
                    return "SurfaceAI_" + localStorage.getItem("TaxonomyName") + "_" + globalL5name;
                },
                orientation: 'landscape',

                pageSize: 'LEGAL',
                titleAttr: 'PDF'
            },
            {
                extend: 'excel',
                title: function() {
                    return "SurfaceAI_" + localStorage.getItem("TaxonomyName") + "_" + globalL5name;
                },
                titleAttr: 'xlsx'
            },
            {
                extend: 'csv',
                title: function() {
                    return "SurfaceAI_" + localStorage.getItem("TaxonomyName") + "_" + globalL5name;
                },
                titleAttr: 'csv'
            },


        ],
        // buttons: [

        //     'excel', 'colvis',"csv",

        // ],
        language: {
            search: "",
            searchPlaceholder: "Search",
        },
        responsive: true

    })


    $(".buttons-colvis").text("View Settings")

}


function archiveRecord(path, L5, recordName, rowPos, status, id) {
    console.log(status)
    var taxonomyFile = store.get(localStorage.getItem("TaxonomyName"))
    var ArchivePos = taxonomyFile[rowPos][6].indexOf(recordName);
    var fromPath = unescape(path),
        toBeStoredpath = unescape(path).split("\\").splice(0, 5).join("\\") + "\\Archive"
    if (status == "Archive") {
        var confirmation = confirm("Do you want to archive " + recordName + " ?")
        if (taxonomyFile[rowPos][12] != undefined) {
            if (taxonomyFile[rowPos][12][ArchivePos] != undefined) {
                if (taxonomyFile[rowPos][12][ArchivePos][1] == true) {
                    copydir.sync(fromPath, toBeStoredpath + "\\" + recordName);
                    // popmsg("Replaced already archived folder.")
                    // return
                }
            }
        }
        // if(taxonomyFile[rowPos][12])
        if (!confirmation)
            return
            // alert("hi")
        console.log(fromPath, toBeStoredpath + "\\" + recordName)
        try {
            fs.mkdirSync(toBeStoredpath, function(err) {
                if (err) console.error(err)
                else console.log('dir created')

                console.log("done first")
            });
        } catch (err) { console.log('dir exists') }
        try {
            fs.mkdirSync(toBeStoredpath + "\\" + recordName, function(err) {
                console.log('dir created------')
                if (err) console.error(err)
                else console.log('dir created')
                console.log("done first")
            });
        } catch (err) { console.log('dir exists') }
        copydir.sync(fromPath, toBeStoredpath + "\\" + recordName);
        rimraf(fromPath + "\\", function() { console.log("done"); });
        if (taxonomyFile[rowPos][12] != undefined) {
            if (taxonomyFile[rowPos][12][ArchivePos] != undefined)
                taxonomyFile[rowPos][12][ArchivePos][1] = true
            else taxonomyFile[rowPos][12][ArchivePos] = [false, true]
        } else {
            taxonomyFile[rowPos][12] = []
            taxonomyFile[rowPos][12][ArchivePos] = [false, true]
        }
        $('#dataTable').on('click', 'tbody tr', function() {
            if (status == "Archive")
                this.remove()
        });
        // console.log("path", path, "fromPath", fromPath, "toBeStoredpath", toBeStoredpath)
        locationpushtorest(toBeStoredpath + "\\" + recordName + "\\", "archive")
            // TreeJSONcreater(taxonomyFile);
        popmsg("Recording Archived")
    } else {
        if (taxonomyFile[rowPos][12] != undefined) {
            if (taxonomyFile[rowPos][12][ArchivePos] != undefined) {

                if (taxonomyFile[rowPos][12][ArchivePos][0] == false) {

                    $("#flagID" + id)[0].src = "../assets/images/flag-red.svg"
                    taxonomyFile[rowPos][12][ArchivePos][0] = true
                } else {

                    $("#flagID" + id)[0].src = "../assets/images/flag-teal.svg"
                    taxonomyFile[rowPos][12][ArchivePos][0] = false
                }
            } else {
                console.log(taxonomyFile[rowPos][12][ArchivePos], ArchivePos)
                taxonomyFile[rowPos][12][ArchivePos] = [true, false]
                $("#flagID" + id)[0].src = "../assets/images/flag-red.svg"
            }
        } else {
            taxonomyFile[rowPos][12] = [
                [true, false]
            ]
            $("#flagID" + id)[0].src = "../assets/images/flag-red.svg"
        }
    }
    store.set(localStorage.getItem("TaxonomyName"), taxonomyFile)
    console.log(taxonomyFile[rowPos][6].indexOf(recordName))
}

function locationpushtorest(recName, type) {
    var data = JSON.stringify(recName + '\\');
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function() {
        if (this.readyState === 4) {
            if (type == "dummy") {
                setTimeout(() => {
                    getalldata('Taxonomyinsight');
                }, 10);
            }
            if (type == "tbldata") {
                getalldata('tbldatavalue');
            }
            if (type == "archive") {
                updatearchivexml()
            }
        }
    });
    xhr.open("POST", "http://127.0.0.1:5000/SurfaceAI/setLocation");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.send(data);

}


function change() {
    $(function() {
        // Attach the fancytree widget to an existing <div id="tree"> element
        // and pass the tree options as an argument to the fancytree() function:
        $("#tree").fancytree({
            extensions: ["filter"],
            quicksearch: true,
            source: [jsonString],
            filter: {
                autoApply: true, // Re-apply last filter if lazy data is loaded
                autoExpand: true, // Expand all branches that contain matches while filtered
                counter: true, // Show a badge with number of matching child nodes near parent icons
                fuzzy: false, // Match single characters in order, e.g. 'fb' will match 'FooBar'
                hideExpandedCounter: true, // Hide counter badge if parent is expanded
                hideExpanders: false, // Hide expanders if all child nodes are hidden by filter
                highlight: true, // Highlight matches by wrapping inside <mark> tags
                leavesOnly: false, // Match end nodes only
                nodata: true, // Display a 'no data' status node if result is empty
                mode: "dimm" // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
            },
            activate: function(event, data) {
                //        alert("activate " + data.node);
            },
            lazyLoad: function(event, data) {
                    data.result = jsonString
                }
                // }).on("keydown", function(e){
                //   var c = String.fromCharCode(e.which);
                //   if( c === "F" && e.ctrlKey ) {
                //     $("input[name=search]").focus();
                //   }
        });
        var tree = $("#leftlist").fancytree("getTree");

        /*
         * Event handlers for our little demo interface
         */
        $("input[name=search]").keyup(function(e) {
            var n,
                tree = $.ui.fancytree.getTree(),
                args = "autoApply autoExpand fuzzy hideExpanders highlight leavesOnly nodata".split(" "),
                opts = {},
                filterFunc = $("#branchMode").is(":checked") ? tree.filterBranches : tree.filterNodes,
                match = $(this).val();

            $.each(args, function(i, o) {
                opts[o] = $("#" + o).is(":checked");
            });
            opts.mode = $("#hideMode").is(":checked") ? "hide" : "dimm";

            if (e && e.which == $.ui.keyCode.ESCAPE || $.trim(match) == "") {
                $("button#reset").click();
                return;
            }
            if ($("#regex").is(":checked")) {
                // Pass function to perform match
                n = filterFunc.call(tree, function(node) {
                    return new RegExp(match, "i").test(node.title);
                }, opts);
            } else {
                // Pass a string to perform case insensitive matching
                n = filterFunc.call(tree, match, opts);
            }
            $("button#reset").attr("disabled", false);
            $("span#matches").text("(" + n + " matches)");
        }).focus();

        $("button#reset").click(function(e) {
            $("input[name=search]").val("");
            $("span#matches").text("");
            tree.clearFilter();
            // GenerateTree(jsonString);
        }).attr("disabled", false);

        $("fieldset input:checkbox").change(function(e) {
            var id = $(this).attr("id"),
                flag = $(this).is(":checked");

            // Some options can only be set with general filter options (not method args):
            switch (id) {
                case "counter":
                case "hideExpandedCounter":
                    tree.options.filter[id] = flag;
                    break;
            }
            tree.clearFilter();
            $("input[name=search]").keyup();
        });
    });

}

const windowClose = () => {
    var columns = $("#dataTable").dataTable().api().columns()
    var resultcolumns = $("#dataTable").dataTable().api().columns().visible().splice(0, 30);
    var visibles = []
    console.log(columns)
    console.log(resultcolumns)
    for (var iter = 0; iter < resultcolumns.length; iter++) {
        if (resultcolumns[iter] == false) {
            visibles.push(iter)
            console.log(iter + 1)
        }
    }
    store.set(localStorage.getItem("TaxonomyName") + "_Settings", visibles)
        // $("#dataTable").dataTable().api().columns( columns[0] ).visible( true, false, true, false);
    window.close()
}

const windowMinimize = () => {
    ipcRenderer.send('reports-minimize')
}

function TabEvents(evt, screenName) {
    if (screenName == "Processinsights")
        $("#selectDownloadTable").show()
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(screenName).style.display = "block";
    evt.currentTarget.className += " active";
}

const VideoAnnotation = (path) => {
        var name;
        path = unescape(path)
        localStorage.setItem("currentlySelectedPath", path)
        if (path.split("\\")[path.split("\\").length - 1] == "")
            name = path.split("\\")[path.split("\\").length - 2]
        else
            name = path.split("\\")[path.split("\\").length - 1]

        if (fs.existsSync(path + "\\" + name + ".mp4")) {

            ipcRenderer.send("VIDEOViewer", "reports")
        } else {
            popmsg("Annotated video not yet created")
        }
    }
    // const LIVEVideo = (path) => {
    //     var name;
    //     path = unescape(path)
    //     localStorage.setItem("currentlySelectedPath", path)
    //     if (path.split("\\")[path.split("\\").length - 1] == "")
    //         name = path.split("\\")[path.split("\\").length - 2]
    //     else
    //         name = path.split("\\")[path.split("\\").length - 1]
    //     if (fs.existsSync(path + "\\" + "Surface_AI_" + name + ".mp4")) {
    //         ipcRenderer.send("LIVEVIDEOViewer")
    //     } else {
    //         popmsg("Live video not available")
    //     }
    // }

const SOP = (path) => {
    var name;
    path = unescape(path)
    localStorage.setItem("currentlySelectedPath", path)
    if (path.split("\\")[path.split("\\").length - 1] == "")
        name = path.split("\\")[path.split("\\").length - 2]
    else
        name = path.split("\\")[path.split("\\").length - 1]
    var file_list = []
    fs.readdir(path, function(err, files) {
        files.forEach(function(file) {
            if (file.includes('.pdf')) {
                file_list.push(file)
            }
        });
        file_list.forEach(function(file) {
            var i = file_list.indexOf(file)
            file = file.replace(name + '_', '').replace('.0.pdf', "")
            file_list[i] = Number(file)
        })
        file_list.sort(function(a, b) { return b - a });
        var version = String(file_list[0])
        var pdfurl = String(path + "\\" + name + '_' + version + ".0.pdf");
        if (fs.existsSync(path + "\\" + name + '_' + version + ".0.pdf")) {
            var win = pdfview.showpdf(encodeURIComponent(pdfurl));
        } else {
            popmsg("SOP not yet created")
        }
    });

}
const BPMN = (path) => {
        path = unescape(path)
        localStorage.setItem("currentlySelectedPath", path)
        if (path.split("\\")[path.split("\\").length - 1] == "")
            name = path.split("\\")[path.split("\\").length - 2]
        else
            name = path.split("\\")[path.split("\\").length - 1]
        var file_list = []
        fs.readdir(path, function(err, files) {
            files.forEach(function(file) {
                if (file.includes("AnnotationFlow") && file.includes('.bpmn')) {
                    file_list.push(file)
                }
            });
            file_list.forEach(function(file) {
                var i = file_list.indexOf(file)
                file = file.replace('AnnotationFlow_', '').replace('.0.bpmn', "")
                file_list[i] = Number(file)
            })
            file_list.sort(function(a, b) { return b - a });
            if (file_list.length > 0) {
                var version = String(file_list[0])
            } else var version = '1'
            if (fs.existsSync(path + "\\AnnotationFlow_" + version + ".0.bpmn") && fs.existsSync(path + "\\ApplicationFlow_" + version + ".0.bpmn"))
                ipcRenderer.send('BPMNviewer', "reports")
            else {
                popmsg("BPMN not yet created")
            }
        })
    }
    //------------------------ End of code for process insights---------------------------

//------------------------ Start of code for taxonomy insights---------------------------
var recName;


function mxIconSet(state) {

    this.images = [];
    var graph = state.view.graph;
    var imageToDisplay;
    if (fs.existsSync(imageWithID[state.cell.id])) {
        imageToDisplay = imageWithID[state.cell.id]
    } else if (imageWithID[state.cell.id]) imageToDisplay = '../assets/Images/404.png'
    else return
    const stepData = metadata[state.cell.id]
        // Icon1
    var img = mxUtils.createImage(imageToDisplay.split('\\').join('\\\\'));
    var img2 = new Image();
    img2.onload = function() {
        height = img2.height;
        width = img2.width;
        img.style.position = 'absolute';
        img.style.cursor = 'pointer';
        if ((width / height) < 0.8 && width < 500) {
            img.style.width = String(width * 0.5) + 'px';
            img.style.height = String(height * 0.5) + 'px';
        } else if (height < 400) {
            img.style.width = '350px';
            img.style.height = '205px';
        } else {
            img.style.width = String(width * 0.25) + 'px';
            img.style.height = String(height * 0.25) + 'px';
        }
        img.style.left = (state.x + state.width - 185) + 'px';
        img.style.top = (state.y + state.height + 7) + 'px';

        state.view.graph.container.appendChild(img);
    }
    img2.src = imageToDisplay.split('\\').join('\\\\')
    this.images.push(img);


    var img3 = mxUtils.createImage('../assets/Images/info.png');
    img3.setAttribute('title', metadata[state.cell.id]);
    img3.style.position = 'absolute';
    img3.style.cursor = 'pointer';
    img3.style.width = '14px';
    img3.style.height = '14px';
    img3.style.left = (state.x + state.width - 17) + 'px';
    img3.style.top = (state.y + 3) + 'px';

    mxEvent.addGestureListeners(img3,
        mxUtils.bind(this, function(evt) {
            // Disables dragging the image
            mxEvent.consume(evt);
        })
    );

    state.view.graph.container.appendChild(img3);
    this.images.push(img3);

};

mxIconSet.prototype.destroy = function() {
    if (this.images != null) {
        for (var i = 0; i < this.images.length; i++) {
            var img = this.images[i];
            try {
                img.parentNode.removeChild(img);
            } catch (err) {}
        }
    }

    this.images = null;
};

function main(container, data) {
    var path = localStorage.getItem("currentlySelectedPath")
    if (path.split("\\")[path.split("\\").length - 1] == "") {
        l6 = path.split("\\")[path.split("\\").length - 2]
        l5 = path.split("\\")[path.split("\\").length - 3]
        l4 = path.split("\\")[path.split("\\").length - 4]
        l3 = path.split("\\")[path.split("\\").length - 5]
    } else {
        l6 = path.split("\\")[path.split("\\").length - 1]
        l5 = path.split("\\")[path.split("\\").length - 2]
        l4 = path.split("\\")[path.split("\\").length - 3]
        l3 = path.split("\\")[path.split("\\").length - 4]

    }
    if (!mxClient.isBrowserSupported()) {
        mxUtils.error('Browser is not supported!', 200, false);
    } else {
        var config = mxUtils.load('swimlaneFiles/editors/config/keyhandler-commons.xml')
            //getDocumentElement();
        var editor = new mxEditor(config);
        editor.setGraphContainer(container);
        var graph = editor.graph;
        graph.setTooltips(false);
        var model = graph.getModel();
        var iconTolerance = 20;

        // Shows icons if the mouse is over a cell
        graph.addMouseListener({
            currentState: null,
            currentIconSet: null,
            mouseDown: function(sender, me) {
                // Hides icons on mouse down
                if (this.currentState != null) {
                    this.dragLeave(me.getEvent(), this.currentState);
                    this.currentState = null;
                }
            },
            mouseMove: function(sender, me) {
                if (this.currentState != null && (me.getState() == this.currentState ||
                        me.getState() == null)) {
                    var tol = iconTolerance;
                    var tmp = new mxRectangle(me.getGraphX() - tol,
                        me.getGraphY() - tol, 2 * tol, 2 * tol);

                    if (mxUtils.intersects(tmp, this.currentState)) {
                        return;
                    }
                }

                var tmp = graph.view.getState(me.getCell());

                // Ignores everything but vertices
                if (graph.isMouseDown || (tmp != null && !graph.getModel().isVertex(tmp.cell))) {
                    tmp = null;
                }

                if (tmp != this.currentState) {
                    if (this.currentState != null) {
                        this.dragLeave(me.getEvent(), this.currentState);
                    }

                    this.currentState = tmp;

                    if (this.currentState != null) {
                        this.dragEnter(me.getEvent(), this.currentState);
                    }
                }
            },
            mouseUp: function(sender, me) {},
            dragEnter: function(evt, state) {
                if (this.currentIconSet == null) {
                    this.currentIconSet = new mxIconSet(state);

                }
            },
            dragLeave: function(evt, state) {
                if (this.currentIconSet != null) {
                    this.currentIconSet.destroy();
                    this.currentIconSet = null;
                }
            }
        });

        graph.addListener(mxEvent.DOUBLE_CLICK, function(sender, evt) {
            var cell = evt.getProperty('cell');
            evt.consume();
        });
        // Auto-resizes the container
        graph.border = 125;
        graph.getView().translate = new mxPoint(graph.border / 2, graph.border / 2);
        graph.setResizeContainer(true);
        //graph.graphHandler.setRemoveCellsFromParent(false);


        // Changes the default vertex style in-place
        var style = graph.getStylesheet().getDefaultVertexStyle();
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
        style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'white';
        style[mxConstants.STYLE_FONTSIZE] = 11;
        style[mxConstants.STYLE_STARTSIZE] = 22;
        style[mxConstants.STYLE_WHITE_SPACE] = 'wrap';
        style[mxConstants.STYLE_HORIZONTAL] = false;
        style[mxConstants.STYLE_FONTCOLOR] = 'black';
        style[mxConstants.STYLE_STROKECOLOR] = 'black';
        delete style[mxConstants.STYLE_FILLCOLOR];

        style = mxUtils.clone(style);
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
        style[mxConstants.STYLE_FONTSIZE] = 12;
        style[mxConstants.STYLE_FILLCOLOR] = 'white';
        style[mxConstants.STYLE_ROUNDED] = true;
        style[mxConstants.STYLE_HORIZONTAL] = true;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
        delete style[mxConstants.STYLE_STARTSIZE];
        style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'none';
        graph.getStylesheet().putCellStyle('process', style);


        style = mxUtils.clone(style);
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
        style[mxConstants.STYLE_FILLCOLOR] = 'green';
        delete style[mxConstants.STYLE_ROUNDED];
        graph.getStylesheet().putCellStyle('state', style);


        style1 = mxUtils.clone(style);
        style1[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
        style1[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
        style1[mxConstants.STYLE_FILLCOLOR] = 'red';
        delete style1[mxConstants.STYLE_ROUNDED];
        style[mxConstants.STYLE_SPACING_RIGHT] = 6;
        graph.getStylesheet().putCellStyle('state1', style1);

        style = mxUtils.clone(style);
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_DOUBLE_ELLIPSE;
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
        style[mxConstants.STYLE_SPACING_TOP] = 28;
        style[mxConstants.STYLE_FONTSIZE] = 14;
        style[mxConstants.STYLE_FONTSTYLE] = 1;
        delete style[mxConstants.STYLE_SPACING_RIGHT];
        graph.getStylesheet().putCellStyle('end', style);

        style = graph.getStylesheet().getDefaultEdgeStyle();
        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
        style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK;
        style[mxConstants.STYLE_ROUNDED] = false;
        style[mxConstants.STYLE_FONTCOLOR] = 'black';
        style[mxConstants.STYLE_STROKECOLOR] = 'black';

        graph.alternateEdgeStyle = 'elbow=vertical';

        //$("<img src='../assets/Images/sopHeader.png' style='margin-top:4px;margin-bottom:-16px; margin-left: 58px;'>&emsp;&emsp;").insertBefore($("#diagram")[0].childNodes[0]);
        //$("<img src='../assets/Images/sopFooter.png' style='margin-top:-299px; margin-left: 58px;'>&emsp;&emsp;").insertAfter($("#diagram")[0].childNodes[1]);
        if (graph.isEnabled()) {
            graph.setConnectable(true);
            graph.setAllowDanglingEdges(false);

            var previousIsValidSource = graph.isValidSource;

            graph.isValidSource = function(cell) {
                if (previousIsValidSource.apply(this, arguments)) {
                    var style = this.getModel().getStyle(cell);
                    return style == null || !(style == 'end' || style.indexOf('end') == 0);
                }
                return false;
            };

            graph.isValidTarget = function(cell) {
                var style = this.getModel().getStyle(cell);

                return !this.getModel().isEdge(cell) && !this.isSwimlane(cell) &&
                    (style == null || !(style == 'state' || style.indexOf('state') == 0));
            };
            //    graph.setDropEnabled(true);
            graph.setSplitEnabled(false);
            graph.isValidDropTarget = function(target, cells, evt) {
                if (this.isSplitEnabled() && this.isSplitTarget(target, cells, evt)) {
                    return true;
                }
                var model = this.getModel();
                var lane = false;
                var pool = false;
                var cell = false;
                for (var i = 0; i < cells.length; i++) {
                    var tmp = model.getParent(cells[i]);
                    lane = lane || this.isPool(tmp);
                    pool = pool || this.isPool(cells[i]);
                    cell = cell || !(lane || pool);
                }

                return !pool && cell != lane && ((lane && this.isPool(target)) ||
                    (cell && this.isPool(model.getParent(target))));
            };

            // Adds new method for identifying a pool
            graph.isPool = function(cell) {
                var model = this.getModel();
                var parent = model.getParent(cell);
                return parent != null && model.getParent(parent) == model.getRoot();
            };

            // Changes swimlane orientation while collapsed
            graph.model.getStyle = function(cell) {
                var style = mxGraphModel.prototype.getStyle.apply(this, arguments);
                if (graph.isCellCollapsed(cell)) {
                    if (style != null) {
                        style += ';';
                    } else {
                        style = '';
                    }
                    style += 'horizontal=1;align=left;spacingLeft=14;';
                }
                return style;
            };
            graph.isWrapping = function(cell) {
                return this.model.isCollapsed(cell);
            };
            // Keeps widths on collapse/expand					
            var foldingHandler = function(sender, evt) {
                var cells = evt.getProperty('cells');

                for (var i = 0; i < cells.length; i++) {
                    var geo = graph.model.getGeometry(cells[i]);

                    if (geo.alternateBounds != null) {
                        geo.width = geo.alternateBounds.width;
                    }
                }
            };
            graph.addListener(mxEvent.FOLD_CELLS, foldingHandler);
        }

        new mxSwimlaneManager(graph);
        var layout = new mxStackLayout(graph, false);
        layout.resizeParent = true;
        layout.fill = true;
        layout.isVertexIgnored = function(vertex) {
            return !graph.isSwimlane(vertex);
        }
        var layoutMgr = new mxLayoutManager(graph);

        layoutMgr.getLayout = function(cell) {
            if (!model.isEdge(cell) && graph.getModel().getChildCount(cell) > 0 &&
                (model.getParent(cell) == model.getRoot() || graph.isPool(cell))) {
                layout.fill = graph.isPool(cell);
                return layout;
            }
            return null;
        };

        // Gets the default parent for inserting new cells. This
        // is normally the first child of the root (ie. layer 0).
        var parent = graph.getDefaultParent();

        // Adds cells to the model in a single step
        model.beginUpdate();
        var application_list = []
        var lane_pair = {}
        var count_pair = {}
        try {
            recName = data['Root']['Recording_Header']['Recording_Name']

            var individual_app_count = 0
            for (var i in data) {
                var val = data['Root']['Application_Captured']
                for (var j in val) {
                    if (val[j].constructor == Array) {
                        for (var k in val[j]) {
                            application_list.push(val[j][k]['Process_Name'])
                            count_pair[val[j][k]['Process_Name']] = 0
                            for (var z in data) {
                                var val2 = data['Root']['Activity_Details']
                                for (var x in val2) {
                                    for (var q in val2[x]) {
                                        step = val2[x][q]
                                        if (step['Active_Delete_AutoDel_Indicator'] == '1') {
                                            if (step['Window_Name'] == val[j][k]['Process_Name']) {
                                                count_pair[val[j][k]['Process_Name']] = count_pair[val[j][k]['Process_Name']] + 1
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else if (val[j].constructor == Object) {
                        var single_app = val[j]
                        application_list.push(single_app['Process_Name'])
                        count_pair[single_app['Process_Name']] = 0
                        for (var z in data) {
                            var val2 = data['Root']['Activity_Details']
                            for (var x in val2) {
                                if (val2[x].constructor == Array) {
                                    for (var q in val2[x]) {
                                        step = val2[x][q]
                                        if (step['Active_Delete_AutoDel_Indicator'] == '1') {
                                            if (step['Window_Name'] == single_app['Process_Name']) {
                                                count_pair[single_app['Process_Name']] = count_pair[single_app['Process_Name']] + 1
                                            }
                                        }
                                    }
                                } else if (val2[x].constructor == Object) {
                                    var single_image = val2[x]
                                    if (single_image['Active_Delete_AutoDel_Indicator'] == '1') {
                                        count_pair[single_app['Process_Name']] = count_pair[single_app['Process_Name']] + 1
                                    }
                                }
                            }
                        }
                    } else {}
                }
            }

            application_list = application_list.filter(onlyUnique);
            if (application_list.length == 1) {
                recName = recName.substring(0, 21) + '...'
            }
            var pool1 = graph.insertVertex(parent, null, recName, 0, 0, 640, 100);
            pool1.setConnectable(false);
            for (var x in application_list) {
                var application = application_list[x]
                var count = count_pair[application]
                application = application.substr(0, application.length - 4);
                application = application.toLowerCase().charAt(0).toUpperCase() + application.slice(1)
                application = application + ' (' + String(count) + ')'
                lane_pair[application_list[x]] = graph.insertVertex(pool1, null, application, 0, 0, 640, 145);
                lane_pair[application_list[x]].setConnectable(false);

            }

            String.prototype.splice = function(idx, rem, str) {
                return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
            };

            var x = 40;
            var y = 30;
            var curr_step;
            var prev_step;
            var added_flag = 0
            for (var i in data) {
                var val = data['Root']['Activity_Details']
                for (var j in val) {
                    var location = localStorage.getItem("currentlySelectedPath")
                    var r = 0
                    if (val[j].constructor == Array) {
                        for (var q in val[j]) {
                            step = val[j][q]
                            if (step['Active_Delete_AutoDel_Indicator'] == '1') {
                                var id1 = 'id' + String(r)
                                imageName = step['Image_File_Name']
                                imageName = location + '\\' + imageName
                                imageWithID[id1] = imageName

                                curr_application = step['Window_Name']
                                if (step['Window_Title']) var windowTitle = step['Window_Title']
                                else var windowTitle = "No Title"
                                var annotation = step['Annotation']
                                if (annotation == null) {
                                    annotation = "Annotation Not Entered."
                                }
                                if (step['Window_Title']) var windowTitle = step['Window_Title']
                                else var windowTitle = "No Title"
                                var starttime = step['TimeStamp_Start']
                                var endtime = step['TimeStamp_End']
                                var startDate = new Date("Jan 1, 2019 " + starttime);
                                var endDate = new Date("Jan 1, 2019 " + endtime);
                                var msec = (endDate.getTime() - startDate.getTime())
                                var hh = Math.floor(msec / 1000 / 60 / 60);
                                if (hh < 10) hh = '0' + String(hh)
                                else hh = String(hh)
                                msec -= hh * 1000 * 60 * 60;
                                var mm = Math.floor(msec / 1000 / 60);
                                if (mm < 10) mm = '0' + String(mm)
                                else mm = String(mm)
                                msec -= mm * 1000 * 60;
                                var ss = Math.floor(msec / 1000);
                                if (ss < 10) ss = '0' + String(ss)
                                else ss = String(ss)
                                msec -= ss * 1000;
                                //var total_time = hh + ':' + mm + ':' + ss
                                var total_time = ' '
                                var xy = step['xyCoordinates']
                                var automation = step['Automation_Elements']
                                metadata[id1] = "Application name: " + curr_application + "\nWindow name: " + windowTitle + "\nTime in: " + starttime.slice(0, -7) + "\nTime out: " + endtime.slice(0, -7) + "\nX, Y Coordinates: " + xy + "\nAutomation Elements: " + automation
                                if (annotation.length > 100) {
                                    annotation = annotation.substring(0, 100) + "..."
                                }
                                var n = annotation.length
                                var howBig = n / 25
                                if (howBig > 0) {
                                    for (var b = 1; b <= howBig; b++) {
                                        annotation = annotation.splice(25 * b, 0, "\n ");
                                    }
                                }
                                if (added_flag == 0) {
                                    curr_application = step['Window_Name']
                                    var start = graph.insertVertex(lane_pair[curr_application], null, 'Start', x, 45, 40, 40, 'state');
                                    prev_step = start
                                    x = x + 105
                                    added_flag = 1
                                }
                                if (r == 0) {
                                    curr_step = graph.insertVertex(lane_pair[curr_application], id1, annotation, x, y, 160, 70, 'process');
                                    graph.insertEdge(lane_pair[curr_application], null, total_time, prev_step, curr_step, 'verticalAlign=bottom');
                                    [prev_step, curr_step] = [curr_step, prev_step];
                                }
                                if (r != 0) {
                                    curr_step = graph.insertVertex(lane_pair[curr_application], id1, annotation, x, 30, 160, 70, 'process');
                                    graph.insertEdge(lane_pair[curr_application], null, total_time, prev_step, curr_step, 'verticalAlign=bottom');
                                    [prev_step, curr_step] = [curr_step, prev_step];
                                }
                                x = x + 240

                            }
                            if (r == val[j].length - 1) {
                                var end1 = graph.insertVertex(lane_pair[curr_application], null, 'End', x, 45, 40, 40, 'state1');
                                graph.insertEdge(lane_pair[curr_application], null, total_time, prev_step, end1);
                            }
                            r = r + 1
                        }
                    } else if (val[j].constructor == Object) {
                        var one_image = val[j]
                        if (one_image['Active_Delete_AutoDel_Indicator'] == '1') {

                            var id1 = 'id' + String(r)
                            imageName = one_image['Image_File_Name']
                            imageName = location + '\\' + imageName
                            imageWithID[id1] = imageName

                            curr_application = one_image['Window_Name']
                            var annotation = one_image['Annotation']
                            if (annotation == null) {
                                annotation = "Annotation Not Entered."
                            }
                            if (one_image['Window_Title']) var windowTitle = one_image['Window_Title']
                            else var windowTitle = "No Title"
                            var starttime = one_image['TimeStamp_Start']
                            var endtime = one_image['TimeStamp_End']
                            var xy = one_image['xyCoordinates']
                            var automation = one_image['Automation_Elements']
                            metadata[id1] = "Application name: " + curr_application + "\nWindow name: " + windowTitle + "\nTime in: " + starttime + "\nTime out: " + endtime + "\nX, Y Coordinates: " + xy + "\nAutomation Elements: " + automation
                            annotation.length = 100
                            var n = annotation.length
                            var howBig = n / 25
                            if (howBig > 0) {
                                for (var b = 1; b <= howBig; b++) {
                                    annotation = annotation.splice(25 * b, 0, "\n ");
                                }
                            }
                            curr_application = one_image['Window_Name']
                            var start = graph.insertVertex(lane_pair[curr_application], null, 'Start', x, 45, 40, 40, 'state');
                            prev_step = start
                            x = x + 105
                            curr_step = graph.insertVertex(lane_pair[curr_application], id1, annotation, x, 30, 160, 70, 'process');
                            graph.insertEdge(lane_pair[curr_application], null, total_time, prev_step, curr_step, 'verticalAlign=top');
                            [prev_step, curr_step] = [curr_step, prev_step];
                            x = x + 210
                            var end1 = graph.insertVertex(lane_pair[curr_application], null, 'End', x, 45, 40, 40, 'state1');
                            graph.insertEdge(lane_pair[curr_application], null, total_time, prev_step, end1);
                        }
                    }
                }
            }
            ///pseudo
            //for loop with annotations and applications
            //create vertecx element
            //connect to previous element
            //if application varies increment y position or have a specified y for each applicatio
            var e = null;
            graph.setEnabled(false);

            //saveImage()
        } finally {
            model.endUpdate();
        }
    }
};

function saveImage() {
    var elem = document.getElementById("diagram").children;
    elem[0].setAttribute("id", "diagram1");
    const canvas = document.getElementById('diagram1');
    canvas.style.backgroundColor = 'white';
    saveSvgAsPng.saveSvgAsPng(document.getElementById("diagram1"), recName + "_swimlane.png");
    // domtoimage.toPng(document.getElementById("diagram"), {
    //     quality: 0.5,
    //     style: {
    //         backgroundColor: "white",
    //     },
    // })
    //     .then(function (dataUrl) {
    //         var link = document.createElement('a');
    //         link.download = recName + "_swimlane.png";
    //         link.href = dataUrl;
    //         link.click();
    //     });
}
//------------------------ End of code for taxonomy insights---------------------------

function ViewSwimLane(path, nodeID) {
    console.log(path)
    $("#selectDownloadTable").hide()
    document.getElementById("process-tab").click()
        // $("#hideElement,#recentReportslbl,#leftlist").hide()
    document.getElementById('diagram').innerHTML = ""
    var tree = $("#leftlist").fancytree("getTree");
    console.log(globalFirstL5 + nodeID + 1)
    tree.activateKey('_' + (globalFirstL5 + nodeID + 1)).focusOnSelect = true;
}

function viewIndividualRecordDetails(recordDetails, pos) {
    var TaxRow = store.get(localStorage.getItem("TaxonomyName"))[recordDetails],
        XML_details = ["-", "-", "-", "-", "-", "-"],
        AdditionInfo = ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
        // $("#rightTable,#selectDownloadTable").hide()
    $("#recordNameModal").text(TaxRow[6][pos])
    if (TaxRow[11] != undefined && TaxRow[11][pos] != null) {
        for (var iter = 0; iter < TaxRow[11][pos].length; iter++) {
            if ((iter + 1) == 4) {
                var AHTDerived = TaxRow[11][pos][iter].split(":")[0] + " Hours " + TaxRow[11][pos][iter].split(":")[1] + " Minutes " + TaxRow[11][pos][iter].split(":")[2].substring(0, 2) + " Seconds"
                $("#metrics" + (iter + 1)).text(AHTDerived)
            } else
                $("#metrics" + (iter + 1)).text(TaxRow[11][pos][iter])
        }
    } else {
        for (var iter = 0; iter < 6; iter++) {
            $("#metrics" + (iter + 1)).text("-")
        }
    }
    if (TaxRow[10] != undefined && TaxRow[10][pos] != null) {
        for (var iter = 0; iter < TaxRow[10][pos].length; iter++) {
            $("#metrics" + (iter + 7)).text(TaxRow[10][pos][iter])
        }
    } else {
        for (var iter = 0; iter < 11; iter++) {
            $("#metrics" + (iter + 7)).text("-")
        }
    }
    $("#metrics18").text(TaxRow[5])
    $("#metrics19").text(TaxRow[4])
    $("#metrics20").text(TaxRow[3])
    $("#metrics21").text(TaxRow[2])
    $("#metrics22").text(TaxRow[1])
    $("#metrics23").text(TaxRow[0])
}

function hierarchy() {
    Toxonomy_File = store.get(localStorage.getItem("TaxonomyName"))
    $("#diagram").html("")
    var container = document.getElementById('diagram')
    mxEvent.disableContextMenu(container);
    var graph = new mxGraph(container);
    var l6_with_location = {}

    graph.border = 125;
    graph.getView().translate = new mxPoint(graph.border / 2, 67.5);
    graph.setResizeContainer(true);
    new mxRubberband(graph);

    var style = graph.getStylesheet().getDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    style[mxConstants.STYLE_FONTSIZE] = 12;
    style[mxConstants.STYLE_FILLCOLOR] = 'white';
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_HORIZONTAL] = true;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
    style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'none';
    style[mxConstants.STYLE_FONTCOLOR] = 'black';
    style[mxConstants.STYLE_STROKECOLOR] = 'teal';
    graph.getStylesheet().putCellStyle('process', style);

    style = graph.getStylesheet().getDefaultEdgeStyle();
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
    style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK;
    style[mxConstants.STYLE_ROUNDED] = false;
    style[mxConstants.STYLE_FONTCOLOR] = 'black';
    style[mxConstants.STYLE_STROKECOLOR] = 'teal';

    var layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_NORTH);
    var parent = graph.getDefaultParent();

    graph.getModel().beginUpdate();
    //var highlight = new mxCellTracker(graph, '#00FF00');

    var edge_dict = {}
    var id1 = 1,
        count = 0;
    var root = new Object();
    id1 = id1 + 1;
    root.title = "Taxonomy Structure";
    root.children = [];
    temp_l3 = root.children
    var iteml3 = {},
        l3 = []
    for (var i = 1; i < Toxonomy_File.length; i++) {
        if (Toxonomy_File[i][6] != undefined)
            l3.push(Toxonomy_File[i][3])
    }
    l3 = l3.filter(onlyUnique);
    var l3_dict = {}
    l3.forEach(elementl3 => {
        iteml3["title"] = elementl3
        id1 = id1 + 1
        temp_l3.push(iteml3)
        var l4 = [];
        for (var i = 1; i < Toxonomy_File.length; i++) {
            if (Toxonomy_File[i][3] == elementl3) {
                if (Toxonomy_File[i][6] != undefined)
                    l4.push(Toxonomy_File[i][4])
            }
        }
        iteml3.children = []
        templ4 = iteml3.children;
        l4 = l4.filter(onlyUnique)
        var text
        if (elementl3.length > 21) {
            text = elementl3.substring(0, 21) + '...'
        } else {
            text = elementl3
        }
        l3_dict[elementl3] = graph.insertVertex(parent, null, text + ' (' + String(l4.length) + ')', 0, 0, 165, 45, 'process');
        var iteml4 = {}
        var l4_dict = {}
        l4.forEach(elementl4 => {
            iteml4["title"] = elementl4
            id1 = id1 + 1;
            templ4.push(iteml4)
            l5 = []
            for (var i = 1; i < Toxonomy_File.length; i++) {
                var flagStatus = true
                if (Toxonomy_File[i][4] == elementl4) {
                    if (Toxonomy_File[i][6] != undefined) {
                        if (Toxonomy_File[i][12] != undefined) {
                            for (var iter = 0; iter < Toxonomy_File[i][12].length; iter++) {
                                // console.log(Toxonomy_File[i][12][iter])
                                if (Toxonomy_File[i][12][iter] != null) {
                                    if (Toxonomy_File[i][12][iter][1] == false)
                                        flagStatus = false
                                }
                            }
                        }
                        if (flagStatus != false)
                            l5.push(Toxonomy_File[i][5])
                    }
                }
            }
            iteml4.children = []
            templ5 = iteml4.children
            l5 = l5.filter(onlyUnique)
            var iteml5 = {}
            var l5_dict = {}
            if (elementl4.length > 21) {
                text = elementl4.substring(0, 21) + '...'
            } else {
                text = elementl4
            }
            l4_dict[elementl4] = graph.insertVertex(parent, null, text + ' (' + String(l5.length) + ')', 0, 0, 165, 45, 'process');
            edge_dict[id1] = graph.insertEdge(parent, null, '', l3_dict[elementl3], l4_dict[elementl4])
            l5.forEach(elementl5 => {
                if (count == 0) {
                    globalFirstL5 = id1
                }
                count++
                iteml5["title"] = elementl5
                id1 = id1 + 1
                templ5.push(iteml5)
                var l6 = []
                var activityPaths = []
                var text;
                for (var i = 1; i < Toxonomy_File.length; i++) {

                    if (Toxonomy_File[i][5] == elementl5) {
                        if (Toxonomy_File[i][6] != undefined) {
                            Toxonomy_File[i][6].forEach(e => {
                                var l6FlagStatus = false
                                try {
                                    if (Toxonomy_File[i][12][Toxonomy_File[i][6].indexOf(e)][1] == true)
                                        l6FlagStatus = true
                                    console.log(Toxonomy_File[i][12][Toxonomy_File[i][6].indexOf(e)][1], e)
                                } catch (err) {
                                    l6FlagStatus = false;
                                }
                                if (l6FlagStatus == false) {
                                    console.log(e)
                                    l6.push(e)
                                    index = Toxonomy_File[i][6].indexOf(e)
                                    if (e.length > 21) {
                                        text = e.substring(0, 21) + '...'
                                    } else {
                                        text = e
                                    }
                                    l6_with_location[text] = Toxonomy_File[i][8][index]

                                }
                            })
                        }
                    }
                    /*                     
                                        if (Toxonomy_File[i][5] == elementl5) {
                                            if (Toxonomy_File[i][6] != undefined) {
                                                Toxonomy_File[i][6].forEach(e => {
                                                    l6.push(e)
                                                    index = Toxonomy_File[i][6].indexOf(e)
                                                    if (e.length > 21) {
                                                        text = e.substring(0, 21) + '...'
                                                    } else {
                                                        text = e
                                                    }
                                                    l6_with_location[text] = Toxonomy_File[i][8][index]
                                                    activityPaths.push(Toxonomy_File[i][8][index])
                                                })

                                            }
                                        } */
                }
                l6Count += l6.length
                iteml5.children = []
                templ6 = iteml5.children
                l6 = l6.filter(onlyUnique)
                var iteml6 = {},
                    counter = 0
                var l6_dict = {}
                if (elementl5.length > 21) {
                    text = elementl5.substring(0, 21) + '...'
                } else {
                    text = elementl5
                }
                l5_dict[elementl5] = graph.insertVertex(parent, null, text + ' (' + String(l6.length) + ')', 0, 0, 165, 45, 'process');
                edge_dict[id1] = graph.insertEdge(parent, null, '', l4_dict[elementl4], l5_dict[elementl5])
                l6.forEach(elementl6 => {
                    iteml6["title"] = elementl6
                    id1 = id1 + 1
                    if (elementl6.length > 21) {
                        text = elementl6.substring(0, 21) + '...'
                    } else {
                        text = elementl6
                    }
                    l6_dict[elementl6] = graph.insertVertex(parent, null, text, 0, 0, 165, 45, 'process');
                    edge_dict[id1] = graph.insertEdge(parent, null, '', l5_dict[elementl5], l6_dict[elementl6])
                    templ6.push(iteml6)
                    iteml6 = {}
                    counter++
                })
                iteml5 = {}
            })
            iteml4 = {}
        })
        iteml3 = {}
    })


    graph.addListener(mxEvent.CLICK, function(sender, evt) {
        var cell = evt.getProperty('cell');
        if (cell.value in l6_with_location) {
            $("#diagram").html("")
            localStorage.setItem("currentlySelectedPath", l6_with_location[cell.value])
            var path = l6_with_location[cell.value]
            localStorage.setItem("reportName", (path.split("\\")[path.split("\\").length - 1]))
            locationpushtorest(l6_with_location[cell.value], "dummy")
        }

    });
    layout.execute(parent);
    graph.setEnabled(false);
    graph.getModel().endUpdate();
    if (mxClient.IS_QUIRKS) {
        document.body.style.overflow = 'hidden';
        new mxDivResizer(container);
    }
}

function levels(level, title) {
    Toxonomy_File = store.get(localStorage.getItem("TaxonomyName"))
    $("#diagram").html("")
    var container = document.getElementById('diagram')
    mxEvent.disableContextMenu(container);
    var graph = new mxGraph(container);
    var l6_with_location = {}
    new mxRubberband(graph);

    graph.border = 125;
    graph.getView().translate = new mxPoint(graph.border / 2, 67.5);
    graph.setResizeContainer(true);

    var style = graph.getStylesheet().getDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    style[mxConstants.STYLE_FONTSIZE] = 12;
    style[mxConstants.STYLE_FILLCOLOR] = 'white';
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_HORIZONTAL] = true;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
    style[mxConstants.STYLE_STROKECOLOR] = 'teal';
    style[mxConstants.STYLE_FONTCOLOR] = 'black';
    graph.getStylesheet().putCellStyle('process', style);

    style = graph.getStylesheet().getDefaultEdgeStyle();
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
    style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK;
    style[mxConstants.STYLE_ROUNDED] = false;
    style[mxConstants.STYLE_FONTCOLOR] = 'black';
    style[mxConstants.STYLE_STROKECOLOR] = 'teal';

    var layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_NORTH);
    var parent = graph.getDefaultParent();

    graph.getModel().beginUpdate();

    var edge_dict = {}
    var id1 = 1,
        count = 0;
    var root = new Object();
    id1 = id1 + 1;
    root.title = "Taxonomy Structure";
    root.children = [];
    temp_l3 = root.children
    var iteml3 = {},
        l3 = []
    for (var i = 1; i < Toxonomy_File.length; i++) {
        if (Toxonomy_File[i][6] != undefined)
            l3.push(Toxonomy_File[i][3])
    }
    l3 = l3.filter(onlyUnique);
    var l3_dict = {}
    var text;
    l3.forEach(elementl3 => {
        iteml3["title"] = elementl3
        id1 = id1 + 1
        temp_l3.push(iteml3)
        var l4 = []
        for (var i = 1; i < Toxonomy_File.length; i++) {
            if (Toxonomy_File[i][3] == elementl3) {
                if (Toxonomy_File[i][6] != undefined)
                    l4.push(Toxonomy_File[i][4])
            }
        }
        iteml3.children = []
        templ4 = iteml3.children;
        l4 = l4.filter(onlyUnique)
        var iteml4 = {}
        var l4_dict = {}
        if (elementl3.length > 21) {
            text = elementl3.substring(0, 21) + '...'
        } else {
            text = elementl3
        }
        if (level == 2 && title == elementl3) {
            l3_dict[elementl3] = graph.insertVertex(parent, null, text + ' (' + String(l4.length) + ')', 0, 0, 165, 45, 'process');
        }
        l4.forEach(elementl4 => {
            iteml4["title"] = elementl4

            id1 = id1 + 1;
            templ4.push(iteml4)
            l5 = []
            for (var i = 1; i < Toxonomy_File.length; i++) {
                var flagStatus = true
                if (Toxonomy_File[i][4] == elementl4) {
                    if (Toxonomy_File[i][6] != undefined) {
                        if (Toxonomy_File[i][12] != undefined) {
                            for (var iter = 0; iter < Toxonomy_File[i][12].length; iter++) {
                                // console.log(Toxonomy_File[i][12][iter])
                                if (Toxonomy_File[i][12][iter] != null) {
                                    if (Toxonomy_File[i][12][iter][1] == false)
                                        flagStatus = false
                                }
                            }
                        }
                        if (flagStatus != false)
                            l5.push(Toxonomy_File[i][5])
                    }
                }
            }
            iteml4.children = []
            templ5 = iteml4.children
            l5 = l5.filter(onlyUnique)
            var iteml5 = {}
            var l5_dict = {}
            if (elementl4.length > 21) {
                text = elementl4.substring(0, 21) + '...'
            } else {
                text = elementl4
            }
            if (level == 2 && title == elementl3) {
                l4_dict[elementl4] = graph.insertVertex(parent, null, text + ' (' + String(l5.length) + ')', 0, 0, 165, 45, 'process');
                edge_dict[id1] = graph.insertEdge(parent, null, '', l3_dict[elementl3], l4_dict[elementl4])
            }
            if (level == 3 && title == elementl4) {
                l4_dict[elementl4] = graph.insertVertex(parent, null, text + ' (' + String(l5.length) + ')', 0, 0, 165, 45, 'process');
            }
            l5.forEach(elementl5 => {
                iteml5["title"] = elementl5

                id1 = id1 + 1
                templ5.push(iteml5)
                var l6 = []
                for (var i = 1; i < Toxonomy_File.length; i++) {

                    if (Toxonomy_File[i][5] == elementl5) {
                        if (Toxonomy_File[i][6] != undefined) {
                            Toxonomy_File[i][6].forEach(e => {
                                var l6FlagStatus = false
                                try {
                                    if (Toxonomy_File[i][12][Toxonomy_File[i][6].indexOf(e)][1] == true)
                                        l6FlagStatus = true
                                    console.log(Toxonomy_File[i][12][Toxonomy_File[i][6].indexOf(e)][1], e)
                                } catch (err) {
                                    l6FlagStatus = false;
                                }
                                if (l6FlagStatus == false) {
                                    console.log(e)
                                    l6.push(e)
                                    index = Toxonomy_File[i][6].indexOf(e)
                                    if (e.length > 21) {
                                        text = e.substring(0, 21) + '...'
                                    } else {
                                        text = e
                                    }
                                    l6_with_location[text] = Toxonomy_File[i][8][index]

                                }
                            })
                        }
                    }
                }
                l6Count += l6.length
                iteml5.children = []
                templ6 = iteml5.children
                l6 = l6.filter(onlyUnique)
                var iteml6 = {},
                    counter = 0
                var l6_dict = {}
                if (elementl5.length > 21) {
                    text = elementl3.substring(0, 21) + '...'
                } else {
                    text = elementl5
                }
                if (level == 3 && title == elementl4) {
                    l5_dict[elementl5] = graph.insertVertex(parent, null, text + ' (' + String(l6.length) + ')', 0, 0, 165, 45, 'process');
                    edge_dict[id1] = graph.insertEdge(parent, null, '', l4_dict[elementl4], l5_dict[elementl5])
                }
                if (level == 4 && title == elementl5) {
                    l5_dict[elementl5] = graph.insertVertex(parent, null, text + ' (' + String(l6.length) + ')', 0, 0, 165, 45, 'process');
                }
                l6.forEach(elementl6 => {
                    iteml6["title"] = elementl6
                    id1 = id1 + 1
                    if (elementl6.length > 21) {
                        text = elementl6.substring(0, 21) + '...'
                    } else {
                        text = elementl6
                    }
                    if (level == 4 && title == elementl5) {
                        l6_dict[elementl6] = graph.insertVertex(parent, null, text, 0, 0, 165, 45, 'process');
                        edge_dict[id1] = graph.insertEdge(parent, null, '', l5_dict[elementl5], l6_dict[elementl6])
                    }
                    //index = Toxonomy_File[i][6].indexOf(elementl6)
                    //l6_with_location[element] = Toxonomy_File[i][8][index]
                    templ6.push(iteml6)
                    iteml6 = {}
                    counter++
                })
                iteml5 = {}
            })
            iteml4 = {}
        })
        iteml3 = {}
    })
    graph.addListener(mxEvent.CLICK, function(sender, evt) {
        var cell = evt.getProperty('cell');
        if (cell.value in l6_with_location) {
            $("#diagram").html("")
            localStorage.setItem("currentlySelectedPath", l6_with_location[cell.value])
            var path = l6_with_location[cell.value]
            localStorage.setItem("reportName", (path.split("\\")[path.split("\\").length - 1]))
            locationpushtorest(l6_with_location[cell.value], "dummy")
        }
    });

    layout.execute(parent);
    graph.setEnabled(false);
    graph.getModel().endUpdate();
}