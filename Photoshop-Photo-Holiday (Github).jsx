/*
                                                                                        ***** Photoshop Photo Holiday Script *****
*/
var borderPercent = 0.05; 
var photoPath = "";
var btnPhotoFile = null;
var lblPhotoPath = null;
var photoObj = null;


function createUI()
/*
* This function creates the GUI and returns it.
*/
{
    var userPanel = new Window ("dialog", "Photo Holiday-Chapman", undefined);
    
    var selPhotoGroup = userPanel.add("group", undefined, "PhotoSelect");
    var lblPhotoFile = selPhotoGroup.add("statictext", undefined, "Select Photo:");
    
    var photoFileGroup = userPanel.add("group", undefined, "Photo File");
    photoFileGroup.orientation = "column";
    btnPhotoFile = photoFileGroup.add("button", [0,0,100,22] , "Photo");
    btnPhotoFile.onClick = function(){selectPhotoFile()}; 
    lblPhotoPath = photoFileGroup.add("statictext", [0,0,120,22], "");
    btnRenderPhoto = photoFileGroup.add("button", [0,0,120,30] , "Render");
    btnRenderPhoto.onClick = function(){renderPhotoHoliday()}; 
    
    return userPanel;
}

function selectPhotoFile()
/*
* This function allows the user to select a photo.
*/
{
    var tmpPhotoFile = File.openDialog("Please select the main photo");
    
    if (tmpPhotoFile != null)
    {
        photoObj  = tmpPhotoFile ;
        lblPhotoPath.text = photoObj.path;
    }
}
    
function renderPhotoHoliday ()
/*
* Function invoked when user clicks  the "Render" button, It starts the photo-effect creation.
*/
{
    if (photoObj == null)
        alert("Please select a photo");
    else
        main();
}

    
function main ()
/*
* This function controls the photo-effect creation process.
*/
{
     try
    {
        var origPhotoRef = app.open(photoObj);
    }catch(e){
        alert ("Can't open photo file. Please check file and try again.");
        throw Error("Unexpected error");
    }
 
    createPhoto (origPhotoRef);
    origPhotoRef.close(SaveOptions.DONOTSAVECHANGES);
    controlPanelGUI.close();
}
    
function createPhoto (origPhotoRef)
/*
* This function creates the photo-effect.
*/
{
    origPhotoRef.layers[0].copy();
    
    var borderThickness = 10;
    // The border thickness is calculated from the smaller of the two photo dimensions
    if (origPhotoRef.width < origPhotoRef.height)
        borderThickness = origPhotoRef.width * borderPercent;
    else
        borderThickness = origPhotoRef.width * borderPercent;
    
    // Adds border to photo through creation of new document
    var newDimenArray = [origPhotoRef.width+borderThickness, origPhotoRef.height+borderThickness];
    var borderDocRef = app.documents.add(newDimenArray[0], newDimenArray[1], 72, "Photo Borders", NewDocumentMode.RGB, DocumentFill.WHITE);
    borderDocRef.paste();
    
    // Copies the photo (with border) into new document.
    borderDocRef.layers[0].copy(true);
    var mainDocRef = app.documents.add(newDimenArray[0], newDimenArray[1], 72, "Photo Holiday", NewDocumentMode.RGB);
    mainDocRef.paste();


    borderDocRef.close(SaveOptions.DONOTSAVECHANGES);

    // Creates and positions the first photo
    var firstPhoto = mainDocRef.layers[0];
    firstPhoto.resize(40, 40, AnchorPosition.MIDDLECENTER);
    moveLayerTo(firstPhoto, Math.round((newDimenArray[0]/2) - (newDimenArray[0]*0.2)), Math.round((newDimenArray[1]/8)));

    // Creates, positions and rotates the second photo
    secPhoto = firstPhoto.duplicate(firstPhoto, ElementPlacement.PLACEAFTER);
    moveLayerTo (secPhoto, Math.round((newDimenArray[0]/4) - (newDimenArray[0]*0.2)), Math.round((newDimenArray[1]/2) - (newDimenArray[1]*0.2)));
    secPhoto.rotate(-15);
    
    // Creates, positions and rotates the third photo
    thirdPhoto = firstPhoto.duplicate(firstPhoto, ElementPlacement.PLACEAFTER);
    moveLayerTo (thirdPhoto, Math.round((newDimenArray[0] - (newDimenArray[0]/4)) - (newDimenArray[0]*0.2) ), Math.round((newDimenArray[1]/2) - (newDimenArray[1]*0.2)));
    thirdPhoto.rotate(15);
    
    // Creates main document (overall) border
    mainDocRef.resizeCanvas(mainDocRef.width*1.1,  mainDocRef.height*1.1, AnchorPosition.MIDDLECENTER);
    fillBG (mainDocRef);
    
    
}
    
    
function moveLayerTo(fLayer,fX,fY) 
/*
* Moves layer (fLayer) to position X,Y (fX, fY).
*/
{ 
  var Position = fLayer.bounds;
  Position[0] = fX - Position[0];
  Position[1] = fY - Position[1];
  fLayer.translate(-Position[0],-Position[1]); 
}


function fillBG (photoDocRef)
/*
* This function simply fills a layer with the rgb color [33,30,27]
*/
{
    photoDocRef.activeLayer = photoDocRef.layers[photoDocRef.artLayers.length-1];
    var fillAreaSel = photoDocRef.selection;
    fillAreaSel.select([[0,0], [photoDocRef.width*1.1,0], [photoDocRef.width*1.1, photoDocRef.height*1.1], [0, photoDocRef.height*1.1]]);
    var fillColor = new SolidColor();
    fillColor.rgb.red = 33;
    fillColor.rgb.green = 30;
    fillColor.rgb.blue = 27;
    fillAreaSel.fill (fillColor, ColorBlendMode.NORMAL, 100, false);
    fillAreaSel.deselect();
}


var controlPanelGUI = createUI();  
controlPanelGUI .center(); 
controlPanelGUI .show();
