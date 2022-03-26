import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/dist/client/router";
import { route } from "next/dist/server/router";
import { emitWarning } from "process";
import React, { useEffect, useState } from "react";
import { makeSentence } from "../common";
import { Seo } from "../components/seo";
import { API_BASE_URL } from "../consts";
import { useCounter } from "../counter";
import { SentenceRensponse } from "../types";

type Props = {
  querySentence?: string;
  error?: {
    status: number;
    message: string;
  };
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { sentence } = ctx.query;

  if (sentence && sentence !== null && typeof sentence === "string")
    return {
      props: {
        querySentence: sentence,
      },
    };
  return { props: {} };
};

const Index = ({ querySentence }: Props) => {

  const [sentence, setSentence] = useState("");
  const { count, increment } = useCounter();

  const generateSentence = async () => {
    const newSentence = await makeSentence()
    setSentence(newSentence);
    increment();
    router.push(newSentence)
  }

  useEffect(() => {
    if (querySentence) {
      setSentence(querySentence);
      increment()
      return
    }
    if (!querySentence) {
      generateSentence()
    }
  }, []);

  const router = useRouter()

  const onClickScreen = async () => {
    await generateSentence();
  };

   return (
    <div id="container" onClick={() => onClickScreen()}>
      {(sentence && <Seo sentence={sentence} ogImageUrl={`https://renchon.chat/api/ogp?sentence=${sentence}`}/>) ||
        (querySentence && (
          <Seo
            sentence={querySentence}
            ogImageUrl={`https://renchon.chat/api/ogp?sentence=${querySentence}`}
          />
        ))}

      <div id="balloon">
        <div id="faceicon">
          <img src="./renchon.jpg" alt="renchon" />
        </div>
        <div id="chatting">
          <div id="says">{sentence}</div>
        </div>
      </div>
      <div id="footer">
        <div id="counter">{count}</div>
        <button
          className="btn"
          id="twitter_share_btn"
          onClick={() =>
            window.open(
              `https://twitter.com/intent/tweet?text=単語を覚えるれんちょんbot` +
                encodeURI(
                  `「${sentence}」&url=${`https://renchon.chat/${encodeURIComponent(
                    sentence
                  )}`}`
                ),
              "_blank",
              "noreferrer"
            )
          }
        >
          ツイート
        </button>
        <div>画面をタップするとセリフが生成されます</div>
        <div>
          単語を覚えるれんちょんbot{" "}
          <a
            href="https://twitter.com/nyanpassnanon"
            target="_blank"
            rel="noreferrer noopener"
          >
            @nyanpassnanon
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;