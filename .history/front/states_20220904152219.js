const ENDPOINT = "http://localhost:3000";

const loadTable = () => {
    axios.get(`${ENDPOINT}/states`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                var trHTML = '';
                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.name + '</td>';
                    trHTML += '<td>' + element.province + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showUserEditBox(' + element.id + ')">Edit</button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="stateDelete(' + element.id + ')">Del</button></td>';
                    trHTML += "</tr>";
                });
                document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

loadTable();

const stateCreate = () => {
    const name = document.getElementById("name").value;
    const province = document.getElementById("province").value;

    axios.post(`${ENDPOINT}/states`, {
        name: name,
        province: province,
    })
        .then((response) => {
            Swal.fire(`User ${response.data.name} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create user: ${error.response.data.error} `)
                .then(() => {
                    showStateCreateBox();
                })
        });
}

const getUser = (id) => {
    return axios.get(`${ENDPOINT}/states/` + id);
}

const userEdit = () => {
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const province = document.getElementById("province").value;

    axios.put(`${ENDPOINT}/states/` + id, {
        name: name,
        province: province,
    })
        .then((response) => {
            Swal.fire(`User ${response.data.name} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update user: ${error.response.data.error} `)
                .then(() => {
                    showUserEditBox(id);
                })
        });
}

const stateDelete = async (id) => {
    const user = await getUser(id);
    const data = user.data;
    axios.delete(`${ENDPOINT}/states/` + id)
        .then((response) => {
            Swal.fire(`User ${data.name} deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete user: ${error.response.data.error} `);
            loadTable();
        });
};

const showStateCreateBox = () => {
    Swal.fire({
        title: 'Create user',
        html:
            '<input id="id" type="hidden">' +
            '<input id="name" class="swal2-input" placeholder="Name">' +
            '<input id="province" class="swal2-input" placeholder="Province">',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            stateCreate();
        }
    });
}

const showUserEditBox = async (id) => {
    const user = await getUser(id);
    const data = user.data;
    Swal.fire({
        title: 'Edit User',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="name" class="swal2-input" placeholder="Name" value="' + data.name + '">' +
            '<input id="province" class="swal2-input" placeholder="Province" value="' + data.province + '">',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            userEdit();
        }
    });

}