const imgUploadInputElement = document.querySelector("#imgUploadControl input");
const imgUploadPreviewElement = document.querySelector("#imgUploadControl img");

function showImgPreview() {
    const files = imgUploadInputElement.files;

    if(!files || files.length === 0) {
        imgUploadPreviewElement.style.display= "none";
        return
    }

    const pickedFile = files[0];

    imgUploadPreviewElement.src = URL.createObjectURL(pickedFile);  // URL class in Javascript
    imgUploadPreviewElement.style.display = "block";
}

imgUploadInputElement.addEventListener("change", showImgPreview);