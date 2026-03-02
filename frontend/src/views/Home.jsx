const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-112px)]">
      <h1 className="text-5xl font-bold text-emerald-400 animate-fade-in-up">
        RAPITI HOME
      </h1>
      <p
        className="mt-4 text-gray-400 animate-fade-in-up"
        style={{ animationDelay: "0.12s" }}
      >
        Bienvenido a la página principal
      </p>
    </div>
  );
};

export default Home;