import React, { useState } from "react";
import styles from "./FAQPage.module.scss";
import { faqItems } from "../../Utils/faqArray";

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faqContainer}>
      <h1>Часто задаваемые вопросы</h1>
      <article className={styles.faqList}>
        {faqItems.map((item, index) => (
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
