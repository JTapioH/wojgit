$().ready (() => {
    let astys = {};

    // haetaan asiakastyypit
    $.get({
        url: "http://127.0.0.1:3002/Types",
        success: (result) => {
            astys = result;
            result.forEach((r) => {
                let optstr = `<option value="${r.Avain}">${r.Lyhenne + " " + toTitleCase(r.Selite)}</option>`;
                $('#custType').append(optstr);
                $('#custCustType').append(optstr);
                $('#mcustType').append(optstr);
                $('#mcustCustType').append(optstr);
            });
        }
    });

    // haetaan data
    fetch = () => {
        let sp = searcParameters();
        $.get({
            url: `http://127.0.0.1:3002/Asiakas?${sp}`,
            success: (result) => {
                showResultInTable(result, astys);
        }});
    }

    // bindataan click-event
    $('#searchBtn').click(() => {
        fetch();
    });

    // otetaan kaikki asiakaanlisäysformin elementit yhteen muuttujaan
    let allFields = $([])
        .add($('#custName'))
        .add($('#custAddress'))
        .add($('#custPostNbr'))
        .add($('#custPostOff'))
        .add($('#custCustType'));

    // luodaan asiakkaanlisäysdialogi
    let dialog = $('#addCustDialog').dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        minWidth: 400,
        width: 'auto',
        close: function() {
            form[0].reset();
            allFields.removeClass("ui-state-error");
        }
    });



    // luodaan formi - alkuperäinen funktio
    
    let form = dialog.find("form")
        .on("submit", (event) => {
            event.preventDefault();
            if (validateAddCust(form)) {
                let param = dialog.find("form").serialize();
                addCust(param);
            }
        }
    );
    
    // luodaan asiakkaanmuokkausdialogi
    var muokkausdialogi;
    muokkausdialogi = $('#modifyCustDialog').dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        minWidth: 400,
        width: 'auto',
        close: function() {
            form[0].reset();
            allFields.removeClass("ui-state-error");
        }
    });

    // Muokkausformin toiminnot.
    var muokkausform;   
    muokkausform = muokkausdialogi.find("form").on("submit", function(event){
        event.preventDefault();
        let param = muokkausdialogi.find("form").serialize();
        updateCust(param);
        console.log(param);
    });

    /*
    Tämä funktio tekee itse muutoksen. Tässä on käytetty filunkia, kun PUT vaatii parametriksi jotain, niin tuossa on nyt
    numero 1, vaikka se ei mihinkään vaikutakaan, vaan tieto muutettavasta rivistä menee perille formin kautta.
    */
    updateCust = (param) => {
        $.ajax({
            url: `http://127.0.0.1:3002/Asiakas/1`,
            type: 'PUT',
            data: param
        })
        $('#modifyCustDialog').dialog("close");
        fetch();  
    }

    // tekee post-kutsun palvelimelle ja vastauksen saatuaan jatkaa - alkuperäinen funktio
    
    addCust = (param) => {
        $.post("http://127.0.0.1:3002/Asiakas", param)
            .then((data) => {
                showAddCustStat(data);
                $('#addCustDialog').dialog("close");
                fetch();
        });
    }

    // näyttää lisäyksen onnistumisen tai epäonnistumisen  
    showAddCustStat = (data) => {

        if (data.status == 'ok') {
            $('#addStatus').css("color", "green").text("Asiakkaan lisääminen onnistui")
            .show().fadeOut(6000);
        } else {
            $('#addStatus').css("color", "red").text("Lisäämisessä tapahtui virhe: " + data.status_text).show();
        }
    }

    // avataan asiakkaanlisäysdialogi jos sitä ei ole jo avattu
    $('#addCustBtn').click(() => { // 
        const isOpen = $('#addCustDialog').dialog("isOpen");
        if (!isOpen) {
            $('#addCustDialog').dialog("open");
        }
    });

    // avataan asiakkaanlisäysdialogi jos sitä ei ole jo avattu

});

// tarkistaa onko dialogin kentät täytetty ja näyttää varoitukset jos ei.


validateAddCust = (form) => {
    let inputs = form.find('input');
    let valid = true;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value == '') {
            inputs[i].classList.toggle("ui-state-error", true);
            valid = false;
        } else {
            inputs[i].classList.toggle("ui-state-error", false);
        }
    }
    if (form.find('select')[0].value === 'empty') {
        form.find('select')[0].classList.toggle("ui-state-error", true);
        valid = false;
    } else {
        form.find('select')[0].classList.toggle("ui-state-error", false);
    }
    if (valid) {
        $('#warning').hide();
        return true;
    }
    $('#warning').show();
    return false;
}

// palauttaa hakuparametri-stringin jos kentät eivät ole tyhjiä
searcParameters = () => {
    let str = '';
    if ($('#name').val().trim() != '') {
        let name = $('#name').val().trim();
        str += `nimi=${name}`;
    }
    if ($('#address').val().trim() != '') {
        let address = $('#address').val().trim();
        if (str !== '') {
            str += '&';
        }
        str += `osoite=${address}`;
    }
    if ($('#custType').val() !== null) {
        let custType = $('#custType').val();
        if (str !== '') {
            str += '&';
        }
        str+=`asty_avain=${custType}`;
    }
    return str;
}

// tyhjentää data-tablen ja tuo haun tuloksen tableen
showResultInTable = (result, astys) => {
    $('#data tbody').empty();
    result.forEach(element => {
        let trstr = "<tr><td>" + element.nimi + "</td>\n";
        trstr += "<td>" + element.osoite + "</td>\n";
        trstr += "<td>" + element.postinro + "</td>\n";
        trstr += "<td>" + element.postitmp + "</td>\n";
        trstr += "<td>" + element.luontipvm + "</td>\n";
        astys.forEach(asty => {
            if (asty.Avain === element.asty_avain) {
                trstr += "<td>" + toTitleCase(asty.Selite) + "</td>";
            }
        });
        trstr += `<td><button onclick="deleteCustomer(${element.avain});" class="deleteBtn">Poista</button></td>\n`;
        trstr += `<td><button onclick="testiCustomer(${element.avain});"class="updateBtn" id="updateId${element.avain}">Muokkaa</button></td>`;
        trstr += "</tr>\n";
        $('#data tbody').append(trstr);
    });
}

testiCustomer = (key) => {
    $.get({
        url: `http://127.0.0.1:3002/Asiakas?Avain=${key}`,
        success: (result) => {
            
            const isOpen = $('#modifyCustDialog').dialog("isOpen");
            if (!isOpen) {
                $('#modifyCustDialog').dialog("open");
            }
            document.getElementById("mcustId").value = result[0].avain;
            document.getElementById("mcustName").value = result[0].nimi;
            document.getElementById("mcustAddress").value = result[0].osoite;
            document.getElementById("mcustPostNbr").value = result[0].postinro;
            document.getElementById("mcustPostOff").value = result[0].postitmp;
            console.log(result);
        }
    });

}

// poistetaan asiakas. Tehtävä 50.
deleteCustomer = (key) => {
    console.log(key);
    if (isNaN(key)) {
        return;
    }
    $.ajax({
        url: `http://127.0.0.1:3002/Asiakas/${key}`,
        type: 'DELETE',
        success: (result) => {
            fetch();
        }
    });
}

/*
updateCustomer = (key) => {
    console.log(key);
    if (isNaN(key)) {
        return;
    }
    $.ajax({
        url: `http://127.0.0.1:3002/Asiakas/${key}`,
        type: 'PUT',
        success: (result) => {
            fetch();
        }
    })
}*/

toTitleCase = (str) => {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

