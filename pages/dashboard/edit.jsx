import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import { useEffect, useState } from "react";
import postService from "../../services/post.service";
import authService from "../../services/auth.service";
import DashboardDetails from "../../src/components/DashboardDetails";
import SideMenu from "../../src/components/Dashboard/SideMenu";
import EditPostModal from "../../src/components/Modals/EditPostModal";
import DeletePostModal from "../../src/components/Modals/DeletePostModal";
import { useRouter } from "next/router";

    export async function getServerSideProps() {
        const data = await postService.getAllPosts();
        const posts = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            date: doc.data().date instanceof Date ? doc.data().date.toString() : null,
        }));

        return {
            props: {
                posts,
            },
        };
    }

    export default function DashboardEdit({ posts }) {
        function SignOut() {
            return authService.signOutGoogle();
        }
        const router = useRouter();
        const [render, setRender] = useState();

        async function checkAuth() {
            return await authService.stateAuthentication();
        }

        useEffect(() => {
            checkAuth()
                .then((result) => {
                    authService
                        .queryByUsersInAccessOne(result.id)
                        .then((result) => {
                            if (result === true) {
                                setRender(true);
                                //getPosts();
                            } else {
                                SignOut();
                                router.push("/login");
                            }
                        });
                })
                .catch(() => {
                    router.push("/login");
                });
        }, []);

        if (render === true) {
            return(
            <>
                {posts.map((post) =>(
                    <div key={post.id}>
                        <h1>{post.id}</h1>
                    </div>
                ))}
            </>);
        } else {
            return null;
        }
    }

/*            <DashboardDetails>
                <SideMenu />
                <div className="content">
                    <div className="publi" id="publi">
                        <h1>Modificar Publicações</h1>
                        <div className="container">
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Título</th>
                                        <th>Autor</th>
                                        <th>Categoria</th>
                                        <th>Data de Modificação</th>
                                        <th>Ações</th>
                                    </tr>
                                    {Posts.map((post) => (
                                        <tr key={post.id}>
                                            <td>
                                                <a
                                                    href={"/" + post.slug}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {post.title}
                                                </a>
                                            </td>
                                            <td>{post.author}</td>
                                            <td>{post.categories}</td>
                                            <td>{post.lessDate}</td>
                                            <td>
                                                <EditPostModal id={post.id} />
                                            </td>
                                            <td>
                                                <DeletePostModal
                                                    id={post.id}
                                                    url={post.imageUrl}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </DashboardDetails>*/
