import { useState } from "react";
import { Aside } from "../UI/Aside/Aside";

export const InstructionPage = () => {
  const [asideLeft, setToggleAsideLeft] = useState(false);
  const [asideRight, setToggleAsideRight] = useState(false);

  const toggleLeft = () => setToggleAsideLeft(!asideLeft);
  const toggleRight = () => setToggleAsideRight(!asideRight);
  return (
    <div className="container">
      <Aside position={"left"} show={asideLeft} toggleShow={toggleLeft} />
      <main className="content">
        <h2>Main Content</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus
          molestiae ipsum sit officia delectus beatae quibusdam quos dolore
          doloremque amet veniam, voluptate provident suscipit ipsa architecto,
          ea iste corrupti facere non minus commodi expedita laboriosam omnis!
          Fuga, temporibus molestiae dolore dignissimos inventore nemo
          consequuntur nobis, ipsa praesentium nesciunt veritatis. Aliquam ipsa
          eum placeat animi illum laboriosam adipisci expedita! Labore commodi
          voluptatibus id consequuntur dicta eius modi iste incidunt illum
          libero dolore dignissimos, at molestiae error facilis optio soluta
          ullam delectus suscipit voluptate eos, impedit maxime. Quisquam
          dignissimos ipsa deserunt asperiores magni itaque vitae neque maxime,
          ipsam suscipit, odio ab recusandae voluptates optio! Commodi suscipit
          nisi ad recusandae, minus adipisci illo ipsam et laborum assumenda id
          nostrum sunt in dicta molestias. Facere labore adipisci ab quae,
          voluptatem corrupti dolores asperiores sit libero numquam hic et cum,
          pariatur nostrum, atque laudantium iusto quisquam. Praesentium
          delectus aliquam libero quam in debitis mollitia tenetur. Expedita,
          quasi pariatur? Qui quaerat amet atque cumque saepe, veritatis odit
          eum fugiat eius sequi error vero sunt labore aliquid quam! Quasi
          officiis earum magni itaque, fugit inventore labore delectus ea illo
          neque blanditiis numquam dolores minus doloremque provident rerum,
          sequi pariatur maxime ipsa accusantium! Ab commodi est, magni
          consectetur, ullam soluta in sit hic eum consequuntur voluptatibus
          alias molestiae fuga id iure odio inventore similique dicta. Placeat
          iusto aliquid fugit doloribus voluptas. Hic quod dicta minima veniam
          iste. Sequi temporibus unde ad odit aperiam suscipit obcaecati,
          laborum quibusdam sint doloribus eveniet, consectetur vero illum? Quo
          eaque, magni possimus odio labore quod nisi repudiandae amet eum sint,
          rem beatae odit ipsum fuga earum laudantium deserunt suscipit totam ut
          expedita adipisci doloremque assumenda aliquid. Alias esse deserunt
          eaque suscipit saepe commodi dolorum, ab et officia quisquam itaque
          aperiam maxime harum ipsam vel, eos libero. Esse sint earum fuga quod
          placeat magni facere consequatur. Assumenda rerum iusto voluptate
          facilis optio aspernatur maxime nostrum! Laborum aliquid rerum
          possimus consequuntur tempora sunt accusamus amet cum assumenda ad
          omnis voluptatibus, hic eveniet consequatur quaerat reiciendis
          laboriosam excepturi deserunt distinctio, maiores delectus cupiditate
          ex. Aliquid est nulla pariatur quas in ipsam dolorum eveniet, tempore,
          enim omnis distinctio, similique hic cupiditate sint aspernatur
          repellat quaerat culpa veniam nemo? Ratione similique incidunt
          veritatis quos quisquam alias magni perspiciatis cupiditate mollitia
          pariatur enim veniam atque nulla aperiam, odio ex maxime minima
          commodi obcaecati, eum doloribus. Adipisci excepturi laudantium ex
          rerum, blanditiis corporis ea? Atque est commodi ipsum eum numquam
          maiores esse, aperiam totam fugiat sit sint veritatis corrupti id
          corporis fugit animi dolorum rerum ducimus iste aliquid culpa! Impedit
          voluptas totam molestiae reiciendis qui ab explicabo soluta minima
          officia nihil molestias suscipit vitae est doloremque incidunt
          deserunt repellat, dicta enim neque corrupti alias. Ullam unde
          deleniti molestias deserunt ipsum libero perspiciatis provident itaque
          debitis ea esse eveniet dolor possimus sapiente saepe velit
          necessitatibus rem sint qui inventore praesentium, minus officia
          totam. Optio blanditiis aliquid tempora suscipit vitae nostrum
          reprehenderit voluptatem nobis dolor architecto minima excepturi et
          nesciunt inventore doloribus, sed eum mollitia eaque amet incidunt
          quam laborum debitis quod. Sunt suscipit alias eum molestias accusamus
          eligendi distinctio, reprehenderit aliquam, quis omnis dolores numquam
          libero, soluta minima repudiandae! Laboriosam tempore veniam non
          minima temporibus dolorum reiciendis facere ut ipsa obcaecati culpa
          cum incidunt sint perspiciatis voluptatibus aperiam libero neque hic
          labore, soluta perferendis recusandae saepe quos? Error amet
          voluptatem, iusto cumque molestias, qui doloribus adipisci velit ipsum
          delectus ab ducimus perspiciatis recusandae sequi magni fugit nesciunt
          quam reiciendis ipsa? Labore culpa dolores quibusdam laborum magni
          veniam minus sit hic necessitatibus aperiam, quae quas eius commodi?
          Distinctio culpa voluptatum excepturi facilis, necessitatibus corrupti
          incidunt placeat similique nihil, quaerat, laboriosam harum repellat!{" "}
        </p>
      </main>
      <Aside position={"right"} show={asideRight} toggleShow={toggleRight} />
    </div>
  );
};
