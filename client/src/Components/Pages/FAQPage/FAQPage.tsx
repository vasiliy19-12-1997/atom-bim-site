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
    <section className={styles.faqContainer}>
      <h1>Часто задаваемые вопросы</h1>
      <article className={styles.faqList}>
        {faqArray.map((item, index) => (
          <div
            key={index}
            className={`${styles.faqItem} ${
              openIndex === index ? styles.faqItemOpen : ""
            }`}
          >
            <div
              className={styles.faqQuestion}
              onClick={() => toggleAnswer(index)}
            >
              <h2>{item.question}</h2>
              <span>{openIndex === index ? "-" : "+"}</span>
            </div>
            {openIndex === index && (
              <p className={styles.faqAnswer}>{item.answer}</p>
            )}
          </div>
        ))}
      </article>
    </section>
  );
};

export default FAQPage;
