const ENDPOINT = "http://localhost:3000";

const loadTable = () => {
    axios.get(`${ENDPOINT}/formats`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                var trHTML = '';
                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.description + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showFormatEditBox(' + element.id + ')"><img src="/images/edit.png"></button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="formatDelete(' + element.id + ')"><img src="/images/delete.png"></button></td>';
                    trHTML += "</tr>";
                });
                document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

loadTable();

const listingFormats = () => {
    const input1 = document.querySelector("#listingFormats");
    const listingFormats = input1.value;

    axios.get(`${ENDPOINT}/formats?description=` + listingFormats)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                var trHTML = '';

                // console.log(data);

                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.description + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showFormatEditBox(' + element.id + ')"><img src="/images/edit.png"></button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="formatDelete(' + element.id + ')"><img src="/images/delete.png"></button></td>';
                    trHTML += "</tr>";
                });
                    document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

const formatCreate = () => {
    const description = document.getElementById("description").value;

    axios.post(`${ENDPOINT}/formats`, {
        description: description,
    })
        .then((response) => {
            Swal.fire(`Format ${response.data.description} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create format: ${error.response.data.error} `)
                .then(() => {
                    showFormatCreateBox();
                })
        });
}

const getFormat = (id) => {
    return axios.get(`${ENDPOINT}/formats/` + id);
}

const formatEdit = () => {
    const id = document.getElementById("id").value;
    const description = document.getElementById("description").value;

    axios.put(`${ENDPOINT}/formats/` + id, {
        description: description,
    })
        .then((response) => {
            Swal.fire(`Format ${response.data.description} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update format: ${error.response.data.error} `)
                .then(() => {
                    showFormatEditBox(id);
                })
        });
}

const formatDelete = async (id) => {
    const format = getFormat(id);
    const data = format.data;
    axios.delete(`${ENDPOINT}/formats/` + id)
        .then((response) => {
            Swal.fire(`format ${data.description} deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete format: ${error.response.data.error} `);
            loadTable();
        });
};

const showFormatCreateBox = () => {
    Swal.fire({
        title: 'Create format',
        html:
            '<input id="id" type="hidden">' +
            '<input id="description" class="swal2-input" placeholder="description">',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            formatCreate();
        }
    });
}

const showFormatEditBox = async (id) => {
    const format = await getFormat(id);
    const data = format.data;
    Swal.fire({
        title: 'Edit format',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="description" class="swal2-input" placeholder="description" value="' + data.description + '">',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            formatEdit();
        }
    });

}

