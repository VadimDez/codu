import type {
  NextPage,
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from "next";
import Head from "next/head";
import Layout from "../../components/Layout/Layout";
import BioBar from "../../components/BioBar/BioBar";
import prisma from "../../server/db/client";

import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypePrism from "rehype-prism";

const ArticlePage: NextPage = ({
  post,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!post) return null;

  return (
    <>
      <Head>
        <title>Codú | {post.title}</title>
      </Head>
      <Layout>
        <div className="border-t-2">
          <section className="mx-auto pb-4 max-w-xl px-4 sm:px-0">
            <h2 className="pt-4 sm:my-5 text-3xl font-bold leading-tight">
              {post.title}
            </h2>
            <article className="prose prose-invert">
              <ReactMarkdown rehypePlugins={[rehypePrism]}>
                {post.body}
              </ReactMarkdown>
            </article>
          </section>
          <BioBar author={post.user} />
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext<{ slug: string }>
) => {
  const post = await prisma.post.findUnique({
    where: {
      slug: ctx.params?.slug,
    },
    select: {
      title: true,
      body: true,
      user: {
        select: {
          name: true,
          image: true,
          bio: true,
          username: true,
        },
      },
    },
  });

  if (!post) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {
      post,
    },
  };
};

export default ArticlePage;
