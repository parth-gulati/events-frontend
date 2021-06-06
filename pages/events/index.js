import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import EventItem from "@/components/EventItem";
import Link from "next/link";
const PER_PAGE = 5;

export default function EventsPage({ events, page, total }) {
  const lastPage = Math.ceil(total / PER_PAGE);

  return (
    <Layout>
      <h1>Upcoming Events</h1>
      {events.length === 0 && <h3>No Upcoming Events</h3>}
      {events.map((x) => (
        <EventItem key={x.id} evt={x}>
          {x.name}
        </EventItem>
      ))}

      {page > 1 && (
        <Link href={`/events?page=${page - 1}`}>
          <a className="btn-secondary">Prev</a>
        </Link>
      )}
      {page < lastPage && (
        <Link href={`/events?page=${page + 1}`}>
          <a className="btn-secondary">Next</a>
        </Link>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ query: { page = 1 } }) {
  //Total
  const totalRes = await fetch(`${API_URL}/events/count`);

  const total = await totalRes.json();

  //Calculate start page
  const start = +page === 1 ? 0 : (page - 1) * PER_PAGE;
  const res = await fetch(
    `${API_URL}/events?_sort=date:ASC&_limit=${PER_PAGE}&_start=${start}`
  );
  const events = await res.json();

  return {
    props: { events, page: +page, total },
  };
}
