import React, { useEffect, useState } from 'react'
// import post from '../../server/index.json'

import 'keen-slider/keen-slider.min.css'
import SlideDetails from './SlideDetails'

import { useKeenSlider } from 'keen-slider/react'
import postService from '../../services/post.service.js'
import Head from 'next/head'

const Slide = () => {

    const [Posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getPosts()
    }, [])

    const getPosts = async () => {
        const data = await postService.getAllPosts()
        setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        setIsLoading(false)
    }

    const slidePosts = Posts.sort().slice(0, 5)

    const [refCallback] = useKeenSlider({ loop: true },
        [
            (slider) => {
                let timeout
                let mouseOver = false
                function clearNextTimeout() {
                    clearTimeout(timeout)
                }
                function nextTimeout() {
                    clearTimeout(timeout)
                    if (mouseOver) return
                    timeout = setTimeout(() => {
                        slider.next()
                    }, 3000)
                }
                slider.on("created", () => {
                    slider.container.addEventListener("mouseover", () => {
                        mouseOver = true
                        clearNextTimeout()
                    })
                    slider.container.addEventListener("mouseout", () => {
                        mouseOver = false
                        nextTimeout()
                    })
                    nextTimeout()
                })
                slider.on("dragStarted", clearNextTimeout)
                slider.on("animationEnded", nextTimeout)
                slider.on("updated", nextTimeout)
            },
        ]
    )

    return (
        isLoading ? <p>Loading...</p> :
            <SlideDetails>
                <div ref={refCallback} className="keen-slider">
                    {slidePosts && slidePosts.map(post => (
                        <div className="keen-slider__slide" key={post?.id}>
                            <a href={post?.slug}>
                                <img src={post.imageUrl} alt={post?.name} />
                            </a>
                            <div className="slider-description">
                                <div className="slide-tag">
                                    <Head>
                                        <title>{post.title}</title>
                                        <meta name="description" content={post?.description} key="desc" />
                                        <meta property="og:title" content={post?.title} />
                                        <meta property="og:description" content={post?.description} />
                                        <meta property="og:image" content={post.imageUrl} />
                                        <meta name="author" content={post.author} />
                                    </Head>

                                    <span className="latest">HOT NEWS 🔥</span>
                                    <span className="tag">{post.categories === 'Movies' ? 'Filmes & Séries' : null || post.categories === 'Games' ? 'Video Games' : null || post.categories === 'Technologies' ? 'Ciência & Tecnologia' : null || post.categories === 'Animes' ? 'Animes & HQs' : null}</span>
                                    <span className="date">{post?.lessDate}</span>
                                    <span> - </span>
                                    <span className="author">
                                        <a href="#">{post.author}</a>
                                    </span>
                                </div>

                                <a href={post?.slug}><h1>{post?.title}</h1></a>
                                <p>{post?.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </SlideDetails>
    )
}

export default Slide
