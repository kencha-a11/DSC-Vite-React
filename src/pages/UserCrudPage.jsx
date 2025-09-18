import React from 'react'
import StoreUser from '../components/users/UserStore'
import IndexUser from '../components/users/UserIndex'
import ShowUser from '../components/users/UserShow'
import UpdateUser from '../components/users/UserUpdate'
import DeleteUser from '../components/users/UserDelete'

function UserCrudPage() {
    return (
        <>
            <h1>USER CRUD PAGE</h1> 
            <hr />
            <StoreUser />
            <hr />
            <UpdateUser />
            <hr />
            <ShowUser/>
            <hr />
            <DeleteUser />
            <hr />
            <IndexUser />
        </>
    )
}

export default UserCrudPage
