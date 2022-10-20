export default function About() {
  return (
    <div className="p-5">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-lg font-bold py-4">About Jupiter</h1>
        {[
          'Incidunt quam amet ullam nesciunt assumenda occaecati. Animi quibusdam impedit alias quam omnis. Autem nisi minima iusto sunt. Repellat dignissimos sit aperiam nesciunt autem temporibus id et. Ut quo consectetur illo in possimus et non quas.',
          'Neque quis dolores minima quaerat est eligendi recusandae. Aut voluptatem quos consectetur excepturi repellat dolores. Nam sapiente voluptatem eum laboriosam possimus omnis. Veniam atque et voluptatem aut.',
          'Sequi rerum quisquam recusandae. Necessitatibus incidunt debitis doloremque error qui doloribus optio sunt. Est ea eligendi fuga minima facere voluptatem omnis. Iure ut et quo qui eaque. Dolor et corporis tenetur rerum doloremque non ea. Saepe voluptatem suscipit ex.',
        ].map((pText, i) => (
          <p key={i} className="mb-4">
            {pText}
          </p>
        ))}
      </div>
    </div>
  );
}