import { getCollection } from "astro:content";

export interface Props {
  posts?: boolean;
  pages?: boolean;
  url?: string;
}

async function getData(posts = true, pages = false, url?: string) {
  if (url) {
    const response = await fetch(url);
    return await response.json();
  }

  let data = [];
  
  if (posts) {
    const blogPosts = (await getCollection("blog")).sort(
      (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf()
    );
    data = data.concat(blogPosts.map((post) => ({
      slug: post.slug,
      title: post.data.title,
      description: post.data.description,
      date: post.data.pubDate,
    })));
  }

  if (pages) {
    const pageCollection = (await getCollection("pages")).sort(
      (a, b) => a.data.title.localeCompare(b.data.title)
    );
    data = data.concat(pageCollection.map((page) => ({
      slug: page.slug,
      title: page.data.title,
      description: page.data.description || "",
      date: page.data.pubDate || new Date(),
    })));
  }

  return data;
}

export async function GET({ props }: { props: Props }) {
  try {
    const { posts = true, pages = false, url } = props || {};
    const data = await getData(posts, pages, url);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}