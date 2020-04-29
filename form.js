const check_coordinates = {
    'travail':      [106, 436],
    'courses':      [106, 506],
    'sante':        [106, 562],
    'famille':      [106, 613],
    'sport':        [106, 690],
    'judiciaire':   [106, 755],
    'missions':     [106, 808]
}

function completeAndDownloadForm( data ) {
    console.log(data);
    let qrstring = 'Cree le: ' + data.creationdate + ' a ' + data.creationhour + '; ' +
                     'Nom: ' + data.lastname + '; ' +
                     'Prenom: ' + data.name + '; ' +
                     'Naissance: ' + data.birthdate + ' a ' + data.birthplace + '; ' +
                     'Adresse: ' + data.address + ' ' + data.city + '; ' +
                     'Sortie: ' + data.creationdate + ' a ' + data.hikinghour + '; ' +
                     'Motifs: ';
    for ( motive of data.checkset ) {
        qrstring += motive + '-';
    }
    if (qrstring.slice(-1) === '-') {
        qrstring = qrstring.slice(0, -1);
    }
    const img = new Image();
    img.onload = function () {
        // we create a temporary canvas to draw the informations on the form
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height * 2;
        const ctx = canvas.getContext('2d');

        const qrimage = new VanillaQR({
            url: qrstring,
            width: 480,
            height: 480,
            colorLight: "#FFFFFF",
            colorDark: "#000000",
            ecclevel: 2,
            noBorder: true,
        }).toImage("png");

        ctx.drawImage(img, 0, 0);
        // font for simple fields
        ctx.font = "17px ArialMT";
        ctx.fillText(data.name + ' ' + data.lastname, 175, 217);
        ctx.fillText(data.birthdate, 175, 251);
        ctx.fillText(data.birthplace, 128, 284);
        ctx.fillText(data.address, 189, 319);
        ctx.fillText(data.city, 152, 857);
        ctx.fillText(data.creationdate, 130, 891);
        ctx.fillText(data.hikinghour, 282, 891);

        // font for the crossed cases
        ctx.font = "bold 18px Arial";
        for ( coord in check_coordinates ) {
            if ( data.checkset.has(coord) ) {
                ctx.fillText('X', check_coordinates[coord][0], check_coordinates[coord][1]);
            }
        }

        qrimage.onload = function () {
            ctx.drawImage(qrimage, 591, 817, 135, 135);

            const pdf = new jsPDF();
            const imgData = canvas.toDataURL("image/jpeg", 1.0);

            pdf.addImage(imgData, 'JPEG', 0, 0);
            pdf.addPage();
            pdf.addImage(qrimage, 'PNG', 20, 20, 100, 100);
            pdf.save('attestation.pdf');
        }
    }
    img.src = 'attestation.jpg';
}