<template>
    <div class="container">
        <div class="row py-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Users Table</h3>

                        <div class="card-tools">
                            <!-- Button trigger modal -->
                            <button
                                type="button"
                                class="btn btn-success"
                                @click="showAddModal"
                            >
                                <i class="fas fa-user-plus mr-1"></i>
                                <span>Add user</span>
                            </button>
                        </div>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body table-responsive p-0">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Type</th>
                                    <th>Registered At</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(user, index) in users"
                                    :key="user.id"
                                >
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ user.name }}</td>
                                    <td>{{ user.email }}</td>
                                    <td>{{ user.level | capitalize }}</td>
                                    <td>{{ user.created_at | time }}</td>
                                    <td>
                                        <button 
                                            class="btn btn-success btn-sm"
                                            @click="showEditModal(user)"
                                        >
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        |
                                        <button
                                            class="btn btn-danger btn-sm"
                                            @click="deleteUser(user.id)"
                                        >
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- /.card-body -->
                </div>
                <!-- /.card -->
            </div>
        </div>

        <!-- Modal -->
        <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">
                            {{ isModalAdd ? 'Add New User' : 'Edit User' }}
                        </h5>
                        <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form autocomplete="off" @submit.prevent="createUser">
                        <div class="modal-body">
                            <div class="form-group">
                                <input
                                    v-model="form.name"
                                    type="text"
                                    name="name"
                                    placeholder="Name *"
                                    class="form-control"
                                    :class="{
                                        'is-invalid': form.errors.has('name')
                                    }"
                                />
                                <has-error
                                    :form="form"
                                    field="name"
                                ></has-error>
                            </div>

                            <div class="form-group">
                                <input
                                    v-model="form.email"
                                    type="email"
                                    name="email"
                                    placeholder="Email Address *"
                                    class="form-control"
                                    :class="{
                                        'is-invalid': form.errors.has('email')
                                    }"
                                />
                                <has-error
                                    :form="form"
                                    field="email"
                                ></has-error>
                            </div>

                            <div class="form-group">
                                <textarea
                                    v-model="form.biography"
                                    name="biography"
                                    placeholder="Biography"
                                    class="form-control"
                                    :class="{
                                        'is-invalid': form.errors.has(
                                            'biography'
                                        )
                                    }"
                                >
                                </textarea>
                                <has-error
                                    :form="form"
                                    field="biography"
                                ></has-error>
                            </div>

                            <div class="form-group">
                                <select
                                    v-model="form.level"
                                    name="level"
                                    class="form-control"
                                    :class="{
                                        'is-invalid': form.errors.has('level')
                                    }"
                                >
                                    <option value="" selected hidden disabled
                                        >Select Level *</option
                                    >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="author">Author</option>
                                </select>
                                <has-error
                                    :form="form"
                                    field="level"
                                ></has-error>
                            </div>

                            <div class="form-group">
                                <input
                                    v-model="form.password"
                                    type="password"
                                    name="password"
                                    placeholder="Password *"
                                    class="form-control"
                                    :class="{
                                        'is-invalid': form.errors.has(
                                            'password'
                                        )
                                    }"
                                />
                                <has-error
                                    :form="form"
                                    field="password"
                                ></has-error>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                data-dismiss="modal"
                            >
                                Close
                            </button>
                            <button type="submit" class="btn btn-primary" v-if="isModalAdd">
                                Create User
                            </button>
                            <button type="submit" class="btn btn-primary" v-else>
                                Update User
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Users",

    data: function() {
        return {
            users: {},

            isModalAdd: true,

            form: new Form({
                name: "",
                email: "",
                password: "",
                level: "",
                biography: "",
                photo: "profile.png"
            })
        };
    },

    mounted: function() {
        this.fetchUsers();

        eventBus.$on("fetchUser", () => this.fetchUsers());
    },

    methods: {
        showAddModal: function () {
            this.isModalAdd = true
            
            // reset the form from pre-filled values
            this.form.reset()

            // clear the form from errors
            this.form.clear()
            
            $('#exampleModal').modal('show')
        },

        showEditModal: function (user) {
            this.isModalAdd = false

            // fill the form with the given user
            this.form.fill(user)
            
            $('#exampleModal').modal('show')
        },

        fetchUsers: function() {
            axios.get("api/user").then(({ data }) => {
                this.users = data.data;
            });
        },

        createUser: function() {
            this.$Progress.start();

            this.form
                .post("api/user")
                .then(() => {
                    this.$Progress.finish();

                    Toast.fire({
                        icon: "success",
                        title: "User created successfully."
                    });

                    $("#exampleModal").modal("hide");

                    eventBus.$emit("fetchUser");
                })
                .catch(error => {
                    this.$Progress.fail();
                });
        },

        deleteUser: function(id) {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(result => {
                if (result.isConfirmed) {
                    this.$Progress.start();

                    axios
                        .delete(`api/user/${id}`)
                        .then(response => {
                            this.$Progress.finish();

                            Swal.fire(
                                "Deleted!",
                                "User deleted successfully.",
                                "success"
                            );

                            eventBus.$emit("fetchUser");
                        })
                        .catch(error => {
                            this.$Progress.fail();

                            Swal.fire({
                                icon: "error",
                                title: "Failed to delete user.",
                                text: "Something went wrong!",
                            });
                        });
                }
            });
        }
    }
};
</script>
