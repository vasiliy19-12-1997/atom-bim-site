import React, { useEffect, useState } from "react";
import styles from "./FAQPage.module.scss";
import { IFAQItem } from "../../Types/types";
import { fetchFaq } from "../../../API/API";

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqArray, setFaqArray] = useState<IFAQItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchFaq();
        setFaqArray(data);
      } catch (error) {
        setError("Ошибка загрузки данных на уровне компонента");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  return (
    <section className={styles.FaqContainer}>
      <h1>Часто задаваемые вопросы</h1>
      <article className={styles.FaqList}>
        {faqArray.map((item, index) => (
          <div
            key={index}
            className={`${styles.FaqItem} ${
              openIndex === index ? styles.FaqItemOpen : ""
            }`}
          >
            <div
              className={styles.FaqQuestion}
              onClick={() => toggleAnswer(index)}
            >
              <h2>{item.question}</h2>
              <span>{openIndex === index ? "-" : "+"}</span>
            </div>
            {openIndex === index && (
              <p className={styles.FaqAnswer}>{item.answer}</p>
            )}
          </div>
        ))}
      </article>
    </section>
  );
};

export default FAQPage;
