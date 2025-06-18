import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold mb-4 text-black">Inicio</h1>
        <button className="bg-blue-600 text-white py-2 px-4 rounded">Presióname</button>
      </div>
    </Layout>
  );
}