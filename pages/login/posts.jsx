import "@uiw/react-markdown-preview/markdown.css"
import "@uiw/react-md-editor/markdown-editor.css"
//import Link from 'next/link'
import { useEffect, useState } from 'react'
import postService from '../../services/post.service'
import imgService from "../../services/img.service"
import DashboardDetails from "../../src/components/DashboardDetails"
//import SideMenuDetails from '../../src/components/Login/SideMenuDetails'
import SideMenu from '../../src/components/Login/SideMenu'
//import LoginDetails from "../../src/components/LoginDetails"

const Login = () => {
    const [Posts, setPosts] = useState([])

    const getPosts = async () => {
        const data = await postService.getAllPosts()
        setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    useEffect(() => {
        getPosts()
    }, [])

    const handleDelete = async (id, nameImage) => {
        await Promise.all([postService.deletePost(id), imgService.deleteImage(nameImage)])
        getPosts()
    }

    const handleEdit = async (id) => {
        await postService.getPost(id)
    }
    return (
        <DashboardDetails>
            <SideMenu/>
            <div className="content">
                <div className="publi" id="publi">
                    <h1>Modificar Publicações</h1>
                    <div className="container">
                        <table>
                            <tr>
                                <th>Título</th>
                                <th>Autor</th>
                                <th>Categoria</th>
                                <th>Data de Modificação</th>
                                <th>Ações</th>
                            </tr>
                            {
                                Posts.map((post) => (
                                    <tr key={post}>
                                        <a href={'/' + post.slug} target='_blank' rel="noreferrer"><td>{post.title}</td></a>
                                        <td>{post.author}</td>
                                        <td>{post.categories}</td>
                                        <td>{post.lessDate}</td>
                                        <td><button className="editar" onClick={() => handleEdit(post.id)}>Editar</button></td>
                                        <td><button className="deletar" onClick={() => handleDelete(post.id, post.image)}>Deletar</button></td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                </div>
            </div>
        </DashboardDetails>
    )
}

export default Login
