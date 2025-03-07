import React, { useState } from "react";
import styles from "./FAQPage.module.scss";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Какие услуги вы предоставляете?",
    answer:
      "Мы предоставляем полный спектр строительных услуг, включая проектирование, строительство и ремонт.",
  },
  {
    question: "Сколько времени занимает строительство дома?",
    answer:
      "Срок строительства зависит от размера и сложности проекта, но в среднем это занимает от 6 до 12 месяцев.",
  },
  {
    question: "Какие материалы вы используете?",
    answer:
      "Мы используем только высококачественные материалы от проверенных поставщиков.",
  },
];

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.faqContainer}>
      <h1>Часто задаваемые вопросы</h1>
      <div className={styles.faqList}>
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
      </div>
    </div>
  );
};

export default FAQPage;
