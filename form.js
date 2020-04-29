function completeAndDownloadForm( data ) {
    console.log(data);
    const img = new Image();
    img.onload = function () {
        // we create a temporary canvas to draw the informations on the form
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext('2d');

        const qrimage = new VanillaQR({
            url: 'lolilol',
            width: 400,
            height: 400,
            colorLight: "#FFFFFF",
            colorDark: "#000000",
            ecclevel: 1,
            noBorder: true,
        }).toImage("png");

        ctx.drawImage(img, 0, 0);
        ctx.font = "16px Arial";
        ctx.fillText(data.name + ' ' + data.lastname, 166, 218);

        qrimage.onload = function () {
            ctx.drawImage(qrimage, 400, 400);

            const pdf = new jsPDF();
            const imgData = canvas.toDataURL("image/jpeg", 1.0);

            pdf.addImage(imgData, 'JPEG', 0, 0);
            pdf.save('attestation.pdf');
        }
    }
    img.src = 'attestation.jpg';
}