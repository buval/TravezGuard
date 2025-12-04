--
-- PostgreSQL database dump
--

\restrict qHUIfrooxahdvGnREqsXNdcYpiUbJi5IGTH86FdhmTQSwdLbuivbm5SbdGyzDhl

-- Dumped from database version 16.11 (b740647)
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: destinations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.destinations (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    country text NOT NULL,
    description text NOT NULL,
    image_url text NOT NULL,
    category text NOT NULL,
    featured boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    visa_requirements text,
    travel_documents text,
    climate text,
    best_months text,
    latitude text,
    longitude text
);


--
-- Name: expenses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.expenses (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    trip_id character varying NOT NULL,
    category text NOT NULL,
    amount integer NOT NULL,
    date date NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: flight_bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flight_bookings (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying,
    booking_reference character varying NOT NULL,
    flight_data jsonb NOT NULL,
    total_price integer NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    payment_intent_id character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: itinerary_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.itinerary_items (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    trip_id character varying NOT NULL,
    day integer NOT NULL,
    "time" text,
    title text NOT NULL,
    description text,
    location text,
    type text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: passengers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.passengers (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    booking_id character varying NOT NULL,
    passenger_type character varying NOT NULL,
    title character varying NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    date_of_birth date,
    email character varying,
    phone character varying,
    passport_number character varying,
    passport_expiry date,
    passport_country character varying,
    seat_number character varying,
    seat_preference character varying,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


--
-- Name: trips; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trips (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying,
    destination_id character varying,
    title text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    budget integer
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    username character varying,
    password character varying,
    profile_image_url character varying
);


--
-- Data for Name: destinations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.destinations (id, name, country, description, image_url, category, featured, created_at, visa_requirements, travel_documents, climate, best_months, latitude, longitude) FROM stdin;
4bb1b851-a141-4d36-a53f-aa73b539f67c	Swiss Alps	Switzerland	Discover pristine alpine lakes, majestic snow-capped peaks, and charming mountain villages. Perfect for hiking, skiing, and experiencing breathtaking natural beauty in every season.	/assets/generated_images/Mountain_lake_alpine_landscape_a7b30a6f.png	mountain	t	2025-10-28 19:34:03.157969	Schengen visa required for most non-EU nationals. US, UK, Canada, Australia, New Zealand citizens can visit visa-free for up to 90 days within 180 days.	Valid passport (must be valid for at least 3 months beyond departure date). Travel insurance is highly recommended. Proof of sufficient funds may be required.	\N	\N	46.5197	8.0551
2eb02269-ef16-4700-adbc-5742900d7a94	Machu Picchu	Peru	Journey to the legendary Lost City of the Incas, perched high in the Andes Mountains. This archaeological wonder offers stunning mountain vistas and a glimpse into ancient civilization.	/assets/generated_images/Machu_Picchu_Peru_ruins_7f99dac1.png	cultural	t	2025-10-28 19:34:03.157969	No visa required for US, UK, Canada, Australia, EU citizens for stays up to 90 days (tourist). Citizens of some countries require a consular visa before travel.	Valid passport (minimum 6 months validity). Machu Picchu entrance tickets must be purchased in advance. Tourist card (Tarjeta Andina de Migración) provided on arrival. Yellow fever vaccination certificate required if arriving from endemic areas.	\N	\N	-13.1631	-72.5450
94da132e-227d-4100-9d73-f66434ccc43e	Cappadocia	Turkey	Float above fairy chimneys in a hot air balloon and explore underground cities carved into volcanic rock. This surreal landscape offers unique cave hotels and ancient history at every turn.	/assets/generated_images/Cappadocia_Turkey_hot_air_balloons_52a3e247.png	adventure	t	2025-10-28 19:34:03.157969	E-visa available online for US, UK, Australia, China citizens (valid 180 days, allows 90-day stay). EU citizens can enter visa-free for up to 90 days. Some nationalities require consular visa.	Valid passport (minimum 6 months validity beyond entry date). E-visa printout if applicable. Proof of accommodation and return ticket may be requested. Travel insurance recommended.	\N	\N	38.6431	34.8289
ae9a0dc0-ae29-416d-854f-fba1407b0902	Maldives	Maldives	Escape to a tropical paradise with crystal-clear turquoise waters, pristine white sand beaches, and luxurious overwater villas. Perfect for diving, snorkeling, and ultimate relaxation.	/assets/generated_images/Maldives_overwater_bungalows_paradise_b727e2cb.png	beach	t	2025-10-28 19:34:03.157969	Free 30-day tourist visa on arrival for all nationalities. Can be extended up to 90 days. No pre-arranged visa required.	Valid passport (minimum 6 months validity). Confirmed hotel booking or resort reservation. Return/onward ticket. Sufficient funds for stay (credit card statement or cash). Completed health declaration and immigration arrival card.	\N	\N	3.2028	73.2207
a450fb42-f508-4d18-990d-e8a754620d16	Paris	France	Fall in love with the City of Light, home to the Eiffel Tower, Louvre Museum, and charming cafes. Experience world-class art, cuisine, and romance in one of Europe's most iconic cities.	/assets/generated_images/Paris_Eiffel_Tower_twilight_4567ec69.png	city	f	2025-10-28 19:34:03.157969	Schengen visa required for most non-EU nationals. US, UK, Canada, Australia, Japan citizens can visit visa-free for up to 90 days within 180 days for tourism or business.	Valid passport (must be valid for at least 3 months beyond departure). Proof of accommodation in France. Travel insurance covering minimum €30,000 medical expenses (recommended). Return ticket and proof of sufficient funds may be required.	\N	\N	48.8566	2.3522
71c848ce-d004-4c86-98d1-5200dc86ec41	Serengeti	Tanzania	Witness the Great Migration and encounter Africa's incredible wildlife in their natural habitat. Experience unforgettable safari adventures across vast golden savannas under endless African skies.	/assets/generated_images/African_safari_sunset_landscape_b72df65e.png	adventure	f	2025-10-28 19:34:03.157969	Visa required for most nationalities. Available as e-visa online (recommended, $50 USD) or on arrival ($50-100 USD). US, UK, EU, Canada, Australia citizens eligible for visa on arrival.	Valid passport (minimum 6 months validity). Yellow fever vaccination certificate (mandatory if arriving from yellow fever endemic country, recommended for all). Proof of accommodation/safari booking and return ticket may be requested.	\N	\N	-2.3333	34.8333
09ef8713-2efc-4b0a-a145-198f51060245	Santorini	Greece	Experience the iconic white-washed buildings, blue-domed churches, and stunning sunsets over the Aegean Sea. Santorini offers world-class wine, volcanic beaches, and romantic villages perched on dramatic cliffs.	/assets/generated_images/Santorini_Greece_destination_ed8bbac7.png	beach	t	2025-10-28 19:34:03.157969	EU/Schengen visa required for most non-EU nationals. US, UK, Canada, Australia citizens can visit visa-free for up to 90 days within 180 days.	Valid passport (must be valid for at least 3 months beyond stay). Proof of accommodation and return ticket may be requested at border control.	\N	\N	36.3932	25.4615
21231307-c9f6-4765-a2fe-64ba61a5241f	Tokyo	Japan	Immerse yourself in a fascinating blend of ultra-modern technology and ancient traditions. Explore vibrant neighborhoods, savor incredible cuisine, and experience the unique Japanese culture in this dynamic metropolis.	/assets/generated_images/Tokyo_Japan_city_nightscape_9823a378.png	city	t	2025-10-28 19:34:03.157969	Visa-free entry for citizens of 68 countries including US, UK, Canada, Australia for stays up to 90 days. Other nationals require a tourist visa from Japanese embassy/consulate.	Valid passport for duration of stay. Return or onward ticket. Declaration of health and customs form completed on arrival. Some travelers may need to show proof of sufficient funds.	\N	\N	35.6762	139.6503
698a09e8-4a89-4bb6-9e5a-a6ba6a125aa3	Bali	Indonesia	Discover the Island of the Gods with its lush rice terraces, ancient temples, pristine beaches, and vibrant culture. Experience world-class surfing, traditional dance performances, and wellness retreats in this tropical paradise.	/assets/generated_images/Bali_rice_terraces_paradise_ad9311d7.png	beach	t	2025-11-01 22:07:49.509214	Visa-free entry for 30 days for citizens of 169 countries including US, UK, EU, Canada, Australia. Visa on arrival available for $35 USD (30 days, extendable once). E-visa also available online.	Valid passport (minimum 6 months validity and 2 blank pages). Return or onward ticket. Proof of accommodation. Customs declaration form on arrival.	Tropical climate with wet and dry seasons. Dry season (April-September) has sunny days at 27-30°C (81-86°F) with low humidity. Wet season (October-March) brings afternoon showers but still warm at 26-29°C (79-84°F). High humidity year-round.	April-June, September for best weather and fewer crowds. July-August peak season (busy). Avoid January-February (heavy rain). December-March for surfing.	-8.3405	115.0920
95996146-6d3c-4ca8-9355-9f19cdf807db	Iceland	Iceland	Experience the land of fire and ice with otherworldly landscapes featuring volcanoes, glaciers, geysers, and stunning waterfalls. Chase the Northern Lights, relax in geothermal hot springs, and explore unique volcanic terrain.	/assets/generated_images/Iceland_Northern_Lights_spectacle_d091315e.png	adventure	t	2025-11-01 22:07:56.940482	Schengen visa required for most non-EU/EEA nationals. US, UK, Canada, Australia citizens can visit visa-free for up to 90 days within 180 days. No visa required for EU/EEA/Swiss citizens.	Valid passport (minimum 3 months validity beyond departure). Travel insurance highly recommended. Proof of sufficient funds and accommodation may be requested. International driving permit recommended for car rentals.	Subarctic climate with cool summers and relatively mild winters due to Gulf Stream. Summer (June-August) temperatures range 10-15°C (50-59°F) with near 24-hour daylight. Winter (November-March) is cold at -1 to 4°C (30-39°F) with short days. Year-round unpredictable weather.	June-August for midnight sun, hiking, and accessible highlands. September-March for Northern Lights viewing. May and September for shoulder season (fewer crowds). Avoid November-February for short daylight hours.	64.9631	-19.0208
f99ff0eb-1bb1-444b-b30c-66b145bf676c	New York City	United States	Experience the city that never sleeps with its iconic skyline, world-class museums, Broadway shows, and diverse neighborhoods. From Central Park to Times Square, NYC offers endless entertainment, culture, and culinary adventures.	/assets/generated_images/New_York_City_skyline_51e164b0.png	city	t	2025-11-01 22:08:04.749479	ESTA (Electronic System for Travel Authorization) required for Visa Waiver Program countries (most EU, UK, Australia, Japan, etc.) - valid 2 years, $21 USD. Other nationals require US B-2 tourist visa from embassy/consulate. Canadians need valid passport only.	Valid passport (must be valid for duration of stay). ESTA approval or US visa. Return or onward ticket. Proof of sufficient funds. Customs and Border Protection forms.	Humid continental climate with four distinct seasons. Summers (June-August) are hot and humid at 25-30°C (77-86°F). Winters (December-February) are cold at -3 to 5°C (27-41°F) with snow. Spring and fall are mild and pleasant.	April-June, September-November for comfortable weather and outdoor activities. December for holiday atmosphere and lights. Avoid July-August (hot and humid) and January-February (coldest with snow).	40.7128	-74.0060
5b6b8e6c-2fdd-4344-a2ca-23f25fcd2b7a	Dubai	United Arab Emirates	Marvel at futuristic skyscrapers, luxury shopping, and world-record attractions in this desert metropolis. From the Burj Khalifa to indoor skiing, Dubai combines Arabian culture with ultra-modern innovation and opulence.	/assets/generated_images/Dubai_modern_skyline_2ee63a52.png	city	t	2025-11-01 22:08:11.096805	Visa on arrival (free, 30 days) for citizens of 50+ countries including US, UK, EU, Canada, Australia. E-visa available online for other eligible nationalities ($100-250 USD). Some countries require pre-arranged visa.	Valid passport (minimum 6 months validity). Return or onward ticket. Proof of accommodation. Travel insurance recommended. No Israeli passport stamps allowed.	Hot desert climate with extremely hot summers and warm winters. Summer (May-September) is scorching at 35-45°C (95-113°F) with high humidity. Winter (November-March) is pleasant at 20-30°C (68-86°F). Minimal rainfall year-round.	November-March for comfortable weather and outdoor activities. December-February is peak season (busy). Avoid June-August (extreme heat). April and October are transitional (warm but manageable).	25.2048	55.2708
c094702e-b52e-4cee-9508-10c70f33b3f6	Petra	Jordan	Step into ancient history at the rose-red city carved into sandstone cliffs over 2,000 years ago. This UNESCO World Heritage Site offers breathtaking archaeology, desert landscapes, and Nabataean culture.	/assets/generated_images/Petra_Jordan_ancient_wonder_67373cb2.png	cultural	t	2025-11-01 22:08:18.14136	Visa required for most nationalities. Visa on arrival available at Queen Alia Airport ($40-120 USD depending on nationality). Jordan Pass recommended (includes visa fee + entry to Petra and other sites). Free visa for visits over 2 nights.	Valid passport (minimum 6 months validity). Jordan Pass or visa on arrival. Proof of accommodation. Return ticket may be requested. Travel insurance recommended.	Hot desert climate with extreme temperature variations. Summer (June-August) is very hot at 30-35°C (86-95°F) but dry. Winter (December-February) is mild during day 10-15°C (50-59°F) but cold at night. Spring and fall are ideal. Minimal rainfall.	March-May, September-November for comfortable temperatures and clear skies. Avoid June-August (extreme heat makes walking difficult). December-February can be cold and occasionally rainy but fewer tourists.	30.3285	35.4444
30eb88fb-1cb4-4332-8672-3a29406c7f65	Banff	Canada	Explore the Canadian Rockies with pristine turquoise lakes, majestic mountain peaks, abundant wildlife, and endless outdoor adventures. From skiing to hiking, Banff offers year-round natural beauty and adventure.	/assets/generated_images/Banff_Lake_Louise_scenery_8ee5ffa7.png	mountain	t	2025-11-01 22:08:25.936901	eTA (Electronic Travel Authorization, $7 CAD) required for visa-exempt foreign nationals arriving by air (includes US, UK, EU, Australia). Valid up to 5 years. Some nationalities require visitor visa. US citizens need valid passport only.	Valid passport (for duration of stay). eTA or visitor visa. Proof of sufficient funds. Return ticket. Parks Canada pass required for national park entry ($10 CAD/day or $70 CAD/year).	Subarctic climate with short summers and long, cold winters. Summer (June-August) is mild at 10-25°C (50-77°F) ideal for hiking. Winter (November-April) is very cold at -15 to -5°C (5-23°F) with heavy snow for skiing. Spring and fall are cool.	July-August for warmest weather and accessible hiking trails. December-March for skiing and winter sports. September for fall colors and fewer crowds. Avoid April-May (snow melting, roads closed).	51.4968	-115.9281
669727b8-2db0-41b4-9ff5-ce09a79bf695	Bora Bora	French Polynesia	Indulge in the ultimate tropical luxury with crystal-clear lagoons, pristine coral reefs, and overwater bungalows. This island paradise offers world-class snorkeling, diving, and romance in an unforgettable setting.	/assets/generated_images/Bora_Bora_luxury_paradise_2fa98a83.png	beach	f	2025-11-01 22:08:40.679882	Visa-free entry for up to 90 days for citizens of US, UK, EU, Canada, Australia, and many other countries. French territory visa rules apply. Extended stays require French long-stay visa.	Valid passport (minimum 6 months validity beyond stay). Return or onward ticket. Proof of sufficient funds. Accommodation confirmation. Health insurance recommended.	Tropical oceanic climate with warm temperatures year-round. Dry season (May-October) has sunny days at 24-28°C (75-82°F) with gentle trade winds. Wet season (November-April) brings occasional rain but still warm at 26-30°C (79-86°F).	May-October for best weather, calm seas, and ideal water conditions. June-August is peak season (expensive). November-April offers lower prices but possible rain. Year-round warm swimming.	-16.5004	-151.7415
6d481110-dab7-4c88-9522-3a61fdf7e194	Venice	Italy	Navigate the romantic canals of this unique floating city built on 118 islands. Experience gondola rides, stunning Byzantine architecture, world-renowned art, and the magic of a car-free historic center.	/assets/generated_images/Venice_Grand_Canal_romance_1873c041.png	city	f	2025-11-01 22:08:48.372154	Schengen visa required for most non-EU nationals. US, UK, Canada, Australia, Japan citizens can visit visa-free for up to 90 days within 180 days. EU citizens need valid ID/passport only.	Valid passport (minimum 3 months validity beyond departure). Travel insurance covering €30,000 medical expenses (recommended). Proof of accommodation and return ticket may be requested. Venice tourist tax payable (€3-10 per night).	Humid subtropical climate with hot summers and cool winters. Summer (June-August) is hot and humid at 25-30°C (77-86°F). Winter (December-February) is cool and foggy at 3-8°C (37-46°F) with occasional flooding (acqua alta). Spring and fall are pleasant.	April-May, September-October for comfortable weather and manageable crowds. June-August for warmest weather (very crowded and expensive). Avoid November-January for fog, cold, and flooding risk.	45.4408	12.3155
251c87d4-3fb1-46e0-a973-78a5555f89d6	Norwegian Fjords	Norway	Cruise through dramatic landscapes of deep blue fjords flanked by towering cliffs, cascading waterfalls, and charming villages. Experience pristine nature, midnight sun, and outdoor adventures in Norway's most scenic region.	/assets/generated_images/Norwegian_Fjords_majesty_3650d278.png	mountain	f	2025-11-01 22:08:55.149436	Schengen visa required for most non-EU/EEA nationals. US, UK, Canada, Australia citizens can visit visa-free for up to 90 days within 180 days. No visa for EU/EEA/Swiss citizens.	Valid passport (minimum 3 months validity beyond departure). Travel insurance highly recommended. Proof of sufficient funds and accommodation may be requested. International driving permit useful for car rentals.	Oceanic and subarctic climate moderated by Gulf Stream. Summer (June-August) has mild temperatures at 15-20°C (59-68°F) with long daylight. Winter (December-February) is cold at -5 to 3°C (23-37°F) with short days and snow. Year-round rain possible.	May-September for best weather, midnight sun, and accessible hiking. June-July for longest days and wildflowers. September for fall colors and Northern Lights. Winter for snow sports but limited daylight.	61.0000	7.0000
05695199-3ad6-4191-8c09-6db34676792a	Barcelona	Spain	Immerse yourself in Gaudí's architectural masterpieces, Mediterranean beaches, vibrant nightlife, and world-class cuisine. This Catalan capital perfectly blends historic charm with modern innovation and coastal beauty.	/assets/generated_images/Barcelona_Sagrada_Familia_beauty_f7173a26.png	city	f	2025-11-01 22:09:00.88385	Schengen visa required for most non-EU nationals. US, UK, Canada, Australia, Japan citizens can visit visa-free for up to 90 days within 180 days. EU citizens need valid ID/passport only.	Valid passport (minimum 3 months validity beyond departure). Travel insurance covering €30,000 medical expenses (recommended). Proof of accommodation and return ticket may be requested. Sufficient funds for stay.	Mediterranean climate with mild winters and warm summers. Summer (June-September) is warm at 25-30°C (77-86°F) with beach weather. Winter (December-February) is mild at 10-15°C (50-59°F). Spring and fall are pleasant. Low rainfall year-round.	May-June, September-October for warm weather and fewer crowds. July-August for beach season (hot and crowded). December-March for mild winters and cultural exploration. Avoid peak summer for better prices.	41.3851	2.1734
3a93d14a-7427-4bbd-8aad-6aaa4152ef6f	Great Barrier Reef	Australia	Dive into the world's largest coral reef system with vibrant marine life, pristine waters, and unparalleled underwater biodiversity. Experience snorkeling, diving, and island hopping in this natural wonder.	/assets/generated_images/Great_Barrier_Reef_underwater_37741a95.png	beach	f	2025-11-01 22:09:08.552995	eVisitor (free) for EU citizens. ETA (Electronic Travel Authority, $20 AUD) for US, UK, Canada, Japan, Korea citizens. Tourist visa required for other nationalities ($145-1020 AUD). Apply online before travel.	Valid passport (for duration of stay). Approved visa/ETA. Return or onward ticket. Proof of sufficient funds. Completed Incoming Passenger Card. Marine park fees apply for reef visits.	Tropical climate with wet and dry seasons. Dry season (April-November) has sunny days at 23-28°C (73-82°F) and excellent visibility. Wet season (December-March) brings rain, humidity, and possible cyclones at 28-32°C (82-90°F).	June-October for best visibility, calm seas, and ideal diving conditions. April-May and November for shoulder season. Avoid December-March (jellyfish season, cyclones, and heavy rain).	-18.2871	147.6992
5e16204a-d004-4397-a48c-ffa1504bca32	Marrakech	Morocco	Lose yourself in the vibrant souks, stunning palaces, and exotic gardens of this imperial city. Experience rich Moroccan culture, aromatic spices, traditional riads, and the gateway to the Sahara Desert.	/assets/generated_images/Marrakech_vibrant_medina_4e71d73e.png	cultural	f	2025-11-01 22:09:14.341232	Visa-free entry for 90 days for citizens of US, UK, EU, Canada, Australia, and many other countries. Passport stamped on arrival. Extended stays require visa from Moroccan embassy.	Valid passport (minimum 6 months validity beyond departure date). Return or onward ticket. Proof of accommodation. Customs declaration form. Sufficient funds for stay.	Hot semi-arid climate with hot summers and mild winters. Summer (June-August) is very hot at 35-40°C (95-104°F). Winter (November-March) is pleasant at 18-22°C (64-72°F) with cool nights. Spring and fall are ideal. Minimal rainfall.	March-May, September-November for comfortable temperatures and pleasant weather. December-February for mild days and cool nights. Avoid June-August (extreme heat makes sightseeing difficult).	31.6295	-7.9811
c7b03ff3-7872-4ed0-9707-65dd5af5f8c5	Vancouver	Canada	Discover a stunning coastal city surrounded by mountains and ocean, offering world-class dining, diverse neighborhoods, and outdoor adventures. Experience the perfect blend of urban sophistication and natural beauty with beaches, parks, and skiing all within reach.	/assets/generated_images/Vancouver_skyline_and_harbor_6396d5ea.png	city	t	2025-11-02 18:30:37.563578	eTA (Electronic Travel Authorization, $7 CAD) required for visa-exempt foreign nationals arriving by air (includes US, UK, EU, Australia). Valid up to 5 years. Some nationalities require visitor visa. US citizens need valid passport only.	Valid passport (for duration of stay). eTA or visitor visa. Proof of sufficient funds. Return ticket. Health insurance recommended.	Oceanic climate with mild, wet winters and warm, dry summers. Summer (June-September) is pleasant at 18-25°C (64-77°F) with little rain. Winter (November-March) is cool and rainy at 3-8°C (37-46°F) with occasional snow. Spring and fall are mild but wet.	June-September for best weather, festivals, and outdoor activities. May and October for shoulder season with fewer crowds. December for Christmas markets. Avoid November-February for constant rain.	49.2827	-123.1207
a8e2652b-1709-41ad-8718-21aeace3030c	Toronto	Canada	Experience Canada's largest and most diverse city with the iconic CN Tower, world-class museums, vibrant neighborhoods, and a thriving culinary scene. From the waterfront to cultural districts, Toronto offers cosmopolitan excitement and multicultural experiences.	/assets/generated_images/Toronto_CN_Tower_skyline_e1a74acd.png	city	t	2025-11-02 18:30:37.563578	eTA (Electronic Travel Authorization, $7 CAD) required for visa-exempt foreign nationals arriving by air (includes US, UK, EU, Australia). Valid up to 5 years. Some nationalities require visitor visa. US citizens need valid passport only.	Valid passport (for duration of stay). eTA or visitor visa. Proof of sufficient funds. Return ticket.	Humid continental climate with warm summers and cold winters. Summer (June-August) is warm at 20-27°C (68-81°F) with humidity. Winter (December-February) is cold at -7 to 0°C (19-32°F) with heavy snow. Spring and fall are mild and pleasant.	May-September for warm weather and outdoor festivals. June-August for summer activities. September-October for fall colors. December for holiday season. Avoid January-February (coldest with snow).	43.6532	-79.3832
f5087bcf-b83d-4aa9-a076-54d42b20e757	Quebec City	Canada	Step into a charming European-style walled city with cobblestone streets, historic architecture, and French culture. From the iconic Château Frontenac to the picturesque Old Town, Quebec City offers romance, history, and exceptional French-Canadian cuisine.	/assets/generated_images/Quebec_City_historic_district_f745d97e.png	cultural	f	2025-11-02 18:30:37.563578	eTA (Electronic Travel Authorization, $7 CAD) required for visa-exempt foreign nationals arriving by air (includes US, UK, EU, Australia). Valid up to 5 years. Some nationalities require visitor visa. US citizens need valid passport only.	Valid passport (for duration of stay). eTA or visitor visa. Proof of sufficient funds. Return ticket.	Humid continental climate with warm summers and very cold winters. Summer (June-August) is warm at 18-25°C (64-77°F). Winter (December-March) is very cold at -12 to -3°C (10-27°F) with heavy snow. Spring and fall are cool.	June-September for warm weather and outdoor activities. February for Winter Carnival (snow required). September-October for fall colors. December for Christmas markets and snow. Avoid March-April (slushy, cold).	46.8139	-71.2080
0b1431b2-d0f2-4fae-a6c9-71c39588afe4	Whistler	Canada	Experience one of North America's premier ski resorts with world-class slopes, stunning alpine scenery, and a vibrant village atmosphere. From winter sports to summer mountain biking and hiking, Whistler offers year-round outdoor adventure and luxury.	/assets/generated_images/Whistler_ski_resort_mountains_604f6ff7.png	mountain	f	2025-11-02 18:30:37.563578	eTA (Electronic Travel Authorization, $7 CAD) required for visa-exempt foreign nationals arriving by air (includes US, UK, EU, Australia). Valid up to 5 years. Some nationalities require visitor visa. US citizens need valid passport only.	Valid passport (for duration of stay). eTA or visitor visa. Proof of sufficient funds. Return ticket. Ski pass purchased separately.	Oceanic mountain climate with snowy winters and mild summers. Winter (November-April) has excellent snow conditions at -5 to 5°C (23-41°F). Summer (June-September) is mild at 15-25°C (59-77°F) ideal for hiking. Spring and fall are cool and wet.	December-March for skiing and snowboarding (peak season). July-August for mountain biking and hiking. June and September for shoulder season activities. Avoid April-May and October-November (transition seasons).	50.1163	-122.9574
06713ef1-eab1-4dbe-a129-a363b71f9431	Niagara Falls	Canada	Witness the awe-inspiring power of one of the world's most famous waterfalls with thundering cascades and misty rainbows. Experience boat tours to the base of the falls, scenic trails, and entertainment in this iconic natural wonder on the US-Canada border.	/assets/generated_images/Niagara_Falls_powerful_cascade_65fba4b4.png	adventure	f	2025-11-02 18:30:37.563578	eTA (Electronic Travel Authorization, $7 CAD) required for visa-exempt foreign nationals arriving by air (includes US, UK, EU, Australia). Valid up to 5 years. Some nationalities require visitor visa. US citizens need valid passport only (if arriving by land).	Valid passport (for duration of stay). eTA or visitor visa if arriving by air. Proof of sufficient funds. Return ticket.	Humid continental climate with warm summers and cold winters. Summer (June-August) is warm and humid at 20-28°C (68-82°F). Winter (December-February) is cold at -5 to 2°C (23-36°F) with snow and ice. Spring and fall are mild.	May-September for best weather and full attractions access. June-August for warmest temperatures (most crowded). Winter for frozen falls spectacle but very cold. Avoid March-April (cold, melting snow).	43.0896	-79.0849
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.expenses (id, trip_id, category, amount, date, description, created_at) FROM stdin;
\.


--
-- Data for Name: flight_bookings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.flight_bookings (id, user_id, booking_reference, flight_data, total_price, status, payment_intent_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: itinerary_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.itinerary_items (id, trip_id, day, "time", title, description, location, type, created_at) FROM stdin;
\.


--
-- Data for Name: passengers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.passengers (id, booking_id, passenger_type, title, first_name, last_name, date_of_birth, email, phone, passport_number, passport_expiry, passport_country, seat_number, seat_preference, created_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (sid, sess, expire) FROM stdin;
ySVNUja4_xTL1u2-IKXHGhBDW97lNBGo	{"cookie": {"path": "/", "secure": true, "expires": "2025-11-07T20:46:52.389Z", "httpOnly": true, "originalMaxAge": 604800000}, "replit.com": {"code_verifier": "4Gdd5IHjRW78TEILpIMQvZ3_yAFm-bFZILamJHKpj6w"}}	2025-11-08 19:50:55
Utnll9oqUdmtJTRCD65ZXQMrEjHxY52b	{"cookie": {"path": "/", "expires": "2025-11-09T07:53:26.944Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "passport": {"user": "f635a70a-a3a9-4e45-9710-d4c91325dd6d"}}	2025-11-09 07:53:27
zr1d_bKm8zo2FoQiPAaTnAFiSClZi1o0	{"cookie": {"path": "/", "expires": "2025-11-09T19:12:32.322Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "passport": {"user": "4986143e-621d-45ab-933b-6438dc92aa28"}}	2025-11-12 18:48:08
3Ss46wynjXlaYk00MgzSatvjjZbpm9Vd	{"cookie": {"path": "/", "expires": "2025-11-09T10:12:55.953Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "passport": {"user": "53a86f1b-81c2-468c-b433-c2e4b0d1371e"}}	2025-11-09 10:16:25
\.


--
-- Data for Name: trips; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.trips (id, user_id, destination_id, title, start_date, end_date, notes, created_at, updated_at, budget) FROM stdin;
3b5e533b-1dd8-42e4-8a73-714b326a25ef	49122434	4bb1b851-a141-4d36-a53f-aa73b539f67c	Swiss adventure	2025-10-29	2025-11-11	\N	2025-10-28 20:28:26.103831	2025-10-28 20:28:26.103831	\N
e8213add-3eea-41e5-aba6-3f4745cad8ff	test123	09ef8713-2efc-4b0a-a145-198f51060245	Summer Vacation	2025-07-01	2025-07-10	\N	2025-10-28 20:38:17.604315	2025-10-28 20:38:17.604315	\N
268d0b50-68ee-47d2-a7bf-a1bf784192db	test456	09ef8713-2efc-4b0a-a145-198f51060245	Greek Island Escape	2025-08-15	2025-08-25	\N	2025-10-28 20:41:02.899305	2025-10-28 20:41:02.899305	\N
e5ad6783-74ff-44f5-846b-9c96ea718e7f	923d18a2-a7d9-4624-a2b4-28eda1975b48	09ef8713-2efc-4b0a-a145-198f51060245	Test Trip - Automated	2025-07-14	2025-07-20	Automated test trip created via E2E script.	2025-11-01 20:09:51.42678	2025-11-01 20:09:51.42678	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, first_name, last_name, created_at, updated_at, username, password, profile_image_url) FROM stdin;
GjdyJL	GjdyJL@example.com	John	Doe	2025-10-28 19:45:21.438061	2025-10-28 19:45:21.438061	\N	\N	\N
test123	test@example.com	Test	User	2025-10-28 20:36:42.124844	2025-10-28 20:36:42.124844	\N	\N	\N
test456	traveler@example.com	Jane	Traveler	2025-10-28 20:40:09.577944	2025-10-28 20:40:09.577944	\N	\N	\N
49122434	beptep@hotmail.com	Vito	Buval	2025-10-28 20:27:37.078965	2025-10-29 19:31:10.504	\N	\N	\N
51e7bf6a-d07d-4603-91ac-d7093f45addd	testEW6DRm@example.com	Test	User	2025-11-01 20:01:37.466039	2025-11-01 20:01:37.466039	user9h0QaeQ1	5bf1665a8bfc653ed3a841efe01942ed3aae8668ed88ed5819fd751562385effc91a80add0bd6e4700abb2e7319411f36552685d02892dca1c7ab16d63aef538.3e8d43c68e9b7b2aa69424d8b3884abb	\N
923d18a2-a7d9-4624-a2b4-28eda1975b48	test039s9i@example.com	Test	User	2025-11-01 20:06:47.623149	2025-11-01 20:06:47.623149	userqQdCN9uy	5d85ad1c2775b7e0288da2c6c076928acb33cc6faf129eb0952c76ecd915a46828abcc70b4aff735631455fdf3653c11fd754d38faba0a78f0642115fdbf4c22.9be85c8036b85a41e6a1b8ed5a82264c	\N
c28064b5-4c99-4072-a28c-1d5d9979bca1	shortuser@example.com	Test	User	2025-11-01 20:11:49.709554	2025-11-01 20:11:49.709554	ab	2ee7a69d43319149552a28b0d6bd39e15b759091caba5389406b554db790942e4d15d80ab7ad011100a2ec9fbeb98466669265b173525b0f268cb2e782c8d2be.2c6b105b6e0c854d5e3a6974946d4fda	\N
4f43bb88-a88d-4117-b20f-9e32856580ee	testP1KmEx@example.com	Test	User	2025-11-01 20:14:24.534074	2025-11-01 20:14:24.534074	userMyvzokTl	a644f95b1baac0c8933b09ad12f82ae1c7a418b177b29b18e1b23265c90536f69f018b2fef4e256f3557f7726d17fca12e823ce8b7461f152f7d7a4033a396f4.a0d9d9fb392865272dc1324ff84bd7e0	\N
4986143e-621d-45ab-933b-6438dc92aa28	\N	\N	\N	2025-11-01 20:56:05.280894	2025-11-01 20:56:05.280894	test	e30318b4a7ea2ea54218e9168c0b832e294626dd20f06ff3347207a973d9a68d7b3103622da89b03fdb2563de598c2b57e1973bbb092f0975257c8fc76b247e7.49feb64ae1d22f2a40c11ceae7693294	\N
997b27ed-1da1-47a0-b0fd-001c128a54a7	test2@example.com	\N	\N	2025-11-02 07:52:15.088158	2025-11-02 07:52:15.088158	testuser2	865f4fae5fc74cd05593c09b9857b8969a2c84b1910a8877f746f4ce291b57d9080cec69b1ffa1f607d3ef3bd7c2b1945b10c7164ac52dd2f48b0eb338e3125b.55944142e171b0da6d19bb12f61d198c	\N
220f6a5c-2030-4bc0-93d7-d81a66b1f50c	test3@example.com	\N	\N	2025-11-02 07:52:54.196258	2025-11-02 07:52:54.196258	testuser3	6eed8f7b46eec8b756719221d19339a235ba41d776bd56cd405cbe9e243a7bd5a06084213b7d6d29e52d36a41324020b3c4ddacc8f76f499ad947b73a560a7c6.152b3308e71fc662b6360c2e003a3bcf	\N
f635a70a-a3a9-4e45-9710-d4c91325dd6d	john@example.com	John	Doe	2025-11-02 07:53:26.779986	2025-11-02 07:53:26.779986	john	11f770ff9670881d8026fbc095c2a3dad2c4f8898dea60ee4ca963e72b85c14aa81d6d794a5dd984689266a037be66ddeb03f48f7e779e34f1d3258d5474dd7f.3306697677c6f691b9916af5273c01de	\N
53a86f1b-81c2-468c-b433-c2e4b0d1371e	iuejWQ@example.com	John	Doe	2025-11-02 10:12:55.764792	2025-11-02 10:12:55.764792	testuser_tZ2Lqk	779137ee27a70939d112228e5272e4eb5b65087b70fcb9ab97ff48c41688722ac026e7b701e9a726261250805a4e0f000bbe19b9804f99a64bff2c10f7a2584a.8c1970ab3a566279be3f796ffab27b87	\N
\.


--
-- Name: destinations destinations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destinations
    ADD CONSTRAINT destinations_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: flight_bookings flight_bookings_booking_reference_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flight_bookings
    ADD CONSTRAINT flight_bookings_booking_reference_unique UNIQUE (booking_reference);


--
-- Name: flight_bookings flight_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flight_bookings
    ADD CONSTRAINT flight_bookings_pkey PRIMARY KEY (id);


--
-- Name: itinerary_items itinerary_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.itinerary_items
    ADD CONSTRAINT itinerary_items_pkey PRIMARY KEY (id);


--
-- Name: passengers passengers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passengers
    ADD CONSTRAINT passengers_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: trips trips_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: expenses expenses_trip_id_trips_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_trip_id_trips_id_fk FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;


--
-- Name: flight_bookings flight_bookings_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flight_bookings
    ADD CONSTRAINT flight_bookings_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: itinerary_items itinerary_items_trip_id_trips_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.itinerary_items
    ADD CONSTRAINT itinerary_items_trip_id_trips_id_fk FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;


--
-- Name: passengers passengers_booking_id_flight_bookings_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passengers
    ADD CONSTRAINT passengers_booking_id_flight_bookings_id_fk FOREIGN KEY (booking_id) REFERENCES public.flight_bookings(id) ON DELETE CASCADE;


--
-- Name: trips trips_destination_id_destinations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_destination_id_destinations_id_fk FOREIGN KEY (destination_id) REFERENCES public.destinations(id);


--
-- Name: trips trips_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict qHUIfrooxahdvGnREqsXNdcYpiUbJi5IGTH86FdhmTQSwdLbuivbm5SbdGyzDhl

