import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/app/components/BookEvent";
import { IEvent } from "@/app/database";
import { gitSimilarEventsBySlug } from "@/lib/actions/event.actions";
import EventCard from "@/app/components/EventCard";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailsItem = ({
  icon,
  alt,
  lable,
}: {
  icon: string;
  alt: string;
  lable: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{lable}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>
        {tag}
      </div>
    ))}
  </div>
);

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  "use cache";
  cacheLife("hours");

  const { slug } = await params;
  const response = await fetch(`${BASE_URL}/api/events/${slug}`);
  const { event } = await response.json();

  if (!event) return notFound();

  const similarEvents: IEvent[] = await gitSimilarEventsBySlug(slug);
  console.log("ddsdsdsd", similarEvents);

  return (
    <section id="event">
      <div className="header">
        <h1>{event.title}</h1>
        <h2>Event Description</h2>
        <p>{event.description}</p>
      </div>

      <div className="details">
        {/* LEFT SIDE - event content*/}
        <div className="content">
          <Image
            className="banner"
            src={event.image}
            alt={event.title}
            width={800}
            height={800}
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{event.overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailsItem
              icon="/icons/calendar.svg"
              alt="calendar"
              lable={event.date}
            />
            <EventDetailsItem
              icon="/icons/clock.svg"
              alt="clock"
              lable={event.time}
            />
            <EventDetailsItem
              icon="/icons/pin.svg"
              alt="pin"
              lable={event.location}
            />
            <EventDetailsItem
              icon="/icons/mode.svg"
              alt="mode"
              lable={event.mode}
            />
            <EventDetailsItem
              icon="/icons/audience.svg"
              alt="audience"
              lable={event.audience}
            />
          </section>

          {/* <EventAgenda agendaItems={JSON.parse(event.agenda)} /> */}
          <EventAgenda agendaItems={event.agenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{event.organizer}</p>
          </section>

          {/* <EventTags tags={JSON.parse(event.tags[0])} /> */}
          <EventTags tags={event.tags} />
        </div>
        {/* RIGHT SIDE - booking form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {event.bookings > 0 ? (
              <p className="text-sm">
                {event.bookings} people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot!</p>
            )}

            <BookEvent eventId={event._id} slug={event.slug} />
          </div>
        </aside>
      </div>
      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 &&
            similarEvents.map((similarEvent: IEvent) => (
              <EventCard key={similarEvent.title} {...similarEvent} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetailsPage;
