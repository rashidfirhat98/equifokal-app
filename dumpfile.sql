--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Ubuntu 17.2-1.pgdg22.04+1)
-- Dumped by pg_dump version 17.2 (Ubuntu 17.2-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    type text,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public."Account" OWNER TO postgres;

--
-- Name: Article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Article" (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "coverImageId" integer,
    description text NOT NULL
);


ALTER TABLE public."Article" OWNER TO postgres;

--
-- Name: ArticleGallery; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ArticleGallery" (
    id integer NOT NULL,
    "articleId" integer NOT NULL,
    "galleryId" integer NOT NULL
);


ALTER TABLE public."ArticleGallery" OWNER TO postgres;

--
-- Name: ArticleGallery_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ArticleGallery_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ArticleGallery_id_seq" OWNER TO postgres;

--
-- Name: ArticleGallery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ArticleGallery_id_seq" OWNED BY public."ArticleGallery".id;


--
-- Name: Article_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Article_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Article_id_seq" OWNER TO postgres;

--
-- Name: Article_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Article_id_seq" OWNED BY public."Article".id;


--
-- Name: Follow; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Follow" (
    id text NOT NULL,
    "followerId" text NOT NULL,
    "followingId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Follow" OWNER TO postgres;

--
-- Name: Gallery; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Gallery" (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."Gallery" OWNER TO postgres;

--
-- Name: GalleryImage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GalleryImage" (
    "galleryId" integer NOT NULL,
    "imageId" integer NOT NULL
);


ALTER TABLE public."GalleryImage" OWNER TO postgres;

--
-- Name: Gallery_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Gallery_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Gallery_id_seq" OWNER TO postgres;

--
-- Name: Gallery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Gallery_id_seq" OWNED BY public."Gallery".id;


--
-- Name: Image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Image" (
    "userId" text NOT NULL,
    url text NOT NULL,
    "fileName" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id integer NOT NULL,
    portfolio boolean DEFAULT false NOT NULL,
    "profilePic" boolean DEFAULT false NOT NULL,
    "blurDataUrl" text,
    height integer,
    width integer
);


ALTER TABLE public."Image" OWNER TO postgres;

--
-- Name: Image_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Image_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Image_id_seq" OWNER TO postgres;

--
-- Name: Image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Image_id_seq" OWNED BY public."Image".id;


--
-- Name: Metadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Metadata" (
    aperture double precision,
    "focalLength" double precision,
    "exposureTime" double precision,
    iso integer,
    flash text,
    model text,
    height integer,
    width integer,
    id integer NOT NULL,
    "imageId" integer NOT NULL
);


ALTER TABLE public."Metadata" OWNER TO postgres;

--
-- Name: Metadata_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Metadata_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Metadata_id_seq" OWNER TO postgres;

--
-- Name: Metadata_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Metadata_id_seq" OWNED BY public."Metadata".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "emailVerified" timestamp(3) without time zone,
    password text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    bio text,
    "profilePic" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Article id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article" ALTER COLUMN id SET DEFAULT nextval('public."Article_id_seq"'::regclass);


--
-- Name: ArticleGallery id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ArticleGallery" ALTER COLUMN id SET DEFAULT nextval('public."ArticleGallery_id_seq"'::regclass);


--
-- Name: Gallery id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Gallery" ALTER COLUMN id SET DEFAULT nextval('public."Gallery_id_seq"'::regclass);


--
-- Name: Image id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Image" ALTER COLUMN id SET DEFAULT nextval('public."Image_id_seq"'::regclass);


--
-- Name: Metadata id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Metadata" ALTER COLUMN id SET DEFAULT nextval('public."Metadata_id_seq"'::regclass);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Account" (id, "userId", provider, "providerAccountId", type, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: Article; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Article" (id, title, content, "userId", "createdAt", "updatedAt", "coverImageId", description) FROM stdin;
1	xcvxcv	<p>asdasdasdawsdfgsdfgsdfgsdfgsdfgserygwergwsefdgsdfg</p>	4c50b4a2-4771-4d4f-b7e2-0b63fe387456	2025-04-11 08:11:52.961	2025-04-11 08:11:52.961	\N	Placeholder description
2		<p>This is a testttt article</p>	4c50b4a2-4771-4d4f-b7e2-0b63fe387456	2025-04-12 08:15:15.327	2025-04-12 08:15:15.327	\N	Placeholder description
3		<p>123412sadfasdfadsf</p>	4c50b4a2-4771-4d4f-b7e2-0b63fe387456	2025-04-12 08:19:49.815	2025-04-12 08:19:49.815	\N	Placeholder description
4	wddfsdf	<p>asdfasdfsdafasdfasdfasdfasdfasdfasdfasdfadsfaweasdfasdfasdfasdfsadfasdfasdffxvzxvasfsdfsDfsDfasdfasdfasasf</p>	4c50b4a2-4771-4d4f-b7e2-0b63fe387456	2025-04-13 03:57:06.187	2025-04-13 03:57:06.187	\N	Placeholder description
5	asdfsadfasdfasd	<p>asdgasdgasdgasdgasdgasdgasdgasdgascvzxcvraawgasdgsdg</p>	4c50b4a2-4771-4d4f-b7e2-0b63fe387456	2025-04-13 03:58:18.701	2025-04-13 03:58:18.701	\N	Placeholder description
6	hello	<p>this is a sample passage must be at least 50 characters</p>	4c50b4a2-4771-4d4f-b7e2-0b63fe387456	2025-04-13 07:33:09.219	2025-04-13 07:33:09.219	\N	Placeholder description
13	How to shoot flowers	<p>lorem ipsum <em>pqwoeias;ldkvnsdzl;kfgaes;orignmz;dlkbse;eoirtg</em> <strong>kokopop39ersd </strong></p>	4c50b4a2-4771-4d4f-b7e2-0b63fe387456	2025-04-18 01:36:03.558	2025-04-18 01:36:03.558	21	Placeholder description
16	A whimsical train ride 	<p><em>Sixty years ago</em>, early in the morning of October 1, 1964, a sleek blue and white train slid effortlessly across the urban sprawl of Tokyo, its elevated tracks carrying it south toward the city of Osaka and a place in the history books.</p><p>This was the dawn of&nbsp;Japan’s&nbsp;“bullet train” era, widely regarded as the defining symbol of the country’s astonishing recovery from the trauma of World War II. In tandem with the 1964 Tokyo Olympic Games, this technological marvel of the 1960s marked the country’s return to the top table of the international community.</p><p>In the six decades since that first train, the word Shinkansen – meaning “new trunk line” – has become an internationally recognized byword for speed,&nbsp;travel&nbsp;efficiency and modernity.<br></p><p>Japan remains a world leader in rail technology. Mighty conglomerates such as Hitachi and Toshiba export billions of dollars worth of trains and equipment all over the world every year.</p><p><em>The Shinkansen</em> network has expanded steadily since the 320-mile Tokaido line, linking Tokyo and Shin-Osaka was completed in 1964. Trains run at up to 200 mph (about 322 kph) on routes radiating out from the capital – heading north, south and west to cities such as <strong>Kobe</strong>, <strong>Kyoto</strong>, <strong>Hiroshima</strong> and <strong>Nagano</strong>.</p><p>As well as a symbol of recovery, Shinkansen have been used as a tool for Japan’s continuing economic development and an agent of change in a country bound by convention and tradition.</p>	4c50b4a2-4771-4d4f-b7e2-0b63fe387456	2025-04-18 03:43:48.382	2025-04-18 03:43:48.382	24	The Tokaido Shinkansen is a must-experience high-speed train that connects the must-visit cities, making it the highlight of your trip.
12	test	<p>lorem ipsum pqwoeias;ldkvnsdzl;kfgaes;orignmz;dlkbse;eoirtg <strong>asdl;kghjsd;fglkjsd;flgko939ersd </strong></p>	4c50b4a2-4771-4d4f-b7e2-0b63fe387456	2025-04-18 01:30:13.425	2025-04-18 01:30:13.425	20	Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis nat
14	Eastbound prior to COVID	<p>In March 2019, we were able to travel and safely return from trip to Japan. Life were colorful just before <em>you know what </em>happened. At the time little did I know that it this would be mark my last trip overseas as university students</p>	4c50b4a2-4771-4d4f-b7e2-0b63fe387456	2025-04-18 01:43:21.775	2025-04-18 01:43:21.775	22	Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis nat
15	The red bridge	<p>A photo I took of my buddies, standing on a bridge near the Odawara Castle, Japan. Red bridges stood as iconic features in Japan.</p>	4c50b4a2-4771-4d4f-b7e2-0b63fe387456	2025-04-18 01:48:08.162	2025-04-18 01:48:08.162	23	Lorem ipsum dolor sit amet, consectetuer adipiscin
17	I'm going to be the pirate king	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi aliquet nisl at quam faucibus posuere. Proin egestas nisi sit amet quam tristique, in aliquet felis fringilla. Quisque euismod libero lorem, nec imperdiet mauris scelerisque vel. In mattis sed augue a congue. Aliquam bibendum, lacus sed pulvinar mollis, purus nunc laoreet lacus, vitae auctor sapien metus a orci. Donec a pretium dolor. Integer varius, ex non dapibus elementum, lectus nulla posuere tortor, a laoreet ligula ipsum sit amet urna. Nunc vestibulum ipsum leo. Proin convallis, risus et molestie semper, felis augue commodo sapien, nec elementum nulla nunc a arcu. Vestibulum fringilla neque eu est elementum pretium. Pellentesque porttitor tincidunt eros, vitae sollicitudin eros imperdiet non. Fusce cursus neque sed varius aliquet. Cras eleifend ipsum mattis rutrum faucibus. Phasellus ullamcorper mi nec odio congue, vel dapibus magna maximus.</p><p>Curabitur vulputate sollicitudin urna, vitae consectetur tortor dictum sed. Morbi rhoncus arcu nec dolor ultricies elementum. Nulla luctus <strong>quam lorem, vitae vehicula odio co</strong>mmodo ac. Cras est diam, volutpat in diam eget, pharetra dignissim lacus. Nullam posuere rhoncus tortor quis consectetur. Aliquam finibus arcu ac risus interdum vehicula. Aenean et justo id magna convallis sagittis quis a quam. Quisque dignissim tortor eget aliquet imperdiet.</p><p>Nulla in tincidunt est. Curabitur risus ex, gravida a vulputate ut, dignissim et nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus at sem ullamcorper neque feugiat gravida id eu elit. Nunc hendrerit, purus sed rutrum tempus, tortor ligula sagittis nibh, at congue orci urna id nunc. Maecenas luctus est eget orci tincidunt bibendum. In massa arcu, congue ut mi at, tincidunt sodales eros. Etiam lorem lectus, tempor elementum felis eu, commodo semper urna. Pellentesque eleifend neque in turpis blandit dapibus. Cras consequat venenatis velit, ut congue tellus iaculis et. In hac habitasse platea dictumst. Praesent gravida, ligula et feugiat facilisis, erat lacus pulvinar nulla, a placerat erat massa vel dolor. In dictum mauris ut turpis congue scelerisque.</p><p>Integer nec condimentum felis, ac pretium odio. Mauris quis convallis nisi, quis ultrices tortor. Donec sed rutrum enim, a rutrum ligula. Sed sollicitudin nunc vitae diam elementum eleifend. Sed egestas nisi non dignissim placerat. Quisque sed ex quis mauris mattis porta. In mauris dui, congue sit amet mi vitae, posuere tristique neque. Suspendisse nec posuere purus, id vehicula dolor. Maecenas porta ligula at tortor fermentum sagittis. Aenean nec pretium ante. Phasellus malesuada lectus a ipsum aliquam faucibus. Vestibulum eget turpis mauris. Suspendisse feugiat odio et sapien aliquet, in laoreet odio volutpat. Nam mauris turpis, lobortis nec lectus eget, faucibus tempus velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Sed lobortis, leo eget lobortis mattis, lectus arcu eleifend ligula, ut fringilla justo nibh vel neque. Proin odio est, ultricies ut turpis vitae, mollis lobortis sapien. Fusce sit amet sem molestie, cursus est id, rutrum tellus. Vivamus dolor neque, vulputate vel arcu ac, sollicitudin molestie mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maximus enim vel dignissim sodales. Donec iaculis congue velit, eu pharetra quam vulputate nec. Integer cursus diam lorem, eget cursus eros bibendum eget. Aenean sed quam eget urna dictum bibendum ut eu felis. Praesent sit amet mi cursus, elementum tellus eget, aliquet turpis.</p>	6f37f67f-1de6-4026-97d3-0f591afd5713	2025-05-16 06:58:09.661	2025-05-16 06:58:09.661	65	Tune in for my journey on becoming the pirate king
18	ergwesrg	<p>sdfhsertdhjsrtjesdrtyjerdsytjertyjdsrfgndftjhsdrtjerstjdfgndfgtjdrtyjdrtjdfgndfgndfgndfvndfgnrdtjrtyjretjrdtyjdrfgjdfg sdrfthj dfgjdfgjdfgjdftj sdfghjdfgsdfhjdfgjdfgjdfgjdfgjdf</p>	6f37f67f-1de6-4026-97d3-0f591afd5713	2025-05-16 10:23:22.269	2025-05-16 10:23:22.269	\N	ewadgweadg3qeawrgwearghwerghsdfgherhwesrth
19	Ore wa kaizoku ou ni naru	<p><strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>	6f37f67f-1de6-4026-97d3-0f591afd5713	2025-05-16 10:32:29.567	2025-05-16 10:32:29.567	66	Datebayooo believe it!! EH Grand line grand line bla bla bla..
20	Testtt hello there	<p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>	6f37f67f-1de6-4026-97d3-0f591afd5713	2025-05-18 04:36:36.275	2025-05-18 04:36:36.275	67	Donate: If you use this site regularly and would like to help keep the site on the Internet, please consider donating 
21	The effing strawhats	<p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>	6f37f67f-1de6-4026-97d3-0f591afd5713	2025-05-18 08:25:35.075	2025-05-18 08:25:35.075	76	There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, 
\.


--
-- Data for Name: ArticleGallery; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ArticleGallery" (id, "articleId", "galleryId") FROM stdin;
6	12	8
7	13	8
8	14	9
9	14	8
10	16	8
11	17	12
12	21	13
13	21	12
\.


--
-- Data for Name: Follow; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Follow" (id, "followerId", "followingId", "createdAt") FROM stdin;
c47aeaff-40f4-47d6-ad6a-b27e7f6f6bf3	353e6507-bef6-42df-a896-da63bf55e369	08b6f566-0e45-4199-be37-0fe21af68750	2025-05-01 10:33:21.084
9fa72878-5726-46a2-885c-2287def3462c	353e6507-bef6-42df-a896-da63bf55e369	6f37f67f-1de6-4026-97d3-0f591afd5713	2025-05-01 10:35:34.793
7c19bfcb-a481-4607-9262-e3b3c6a1025d	353e6507-bef6-42df-a896-da63bf55e369	4c50b4a2-4771-4d4f-b7e2-0b63fe387456	2025-05-02 04:35:21.975
0fa3777f-944d-4ede-bcce-8f37193708cf	6f37f67f-1de6-4026-97d3-0f591afd5713	353e6507-bef6-42df-a896-da63bf55e369	2025-05-03 14:45:36.062
4c981530-9cbd-43d4-a77b-6e79664d24a6	08b6f566-0e45-4199-be37-0fe21af68750	4c50b4a2-4771-4d4f-b7e2-0b63fe387456	2025-05-09 08:18:19.996
bdb4dd4b-4694-406e-b538-e2c5ade37b2a	4c50b4a2-4771-4d4f-b7e2-0b63fe387456	6f37f67f-1de6-4026-97d3-0f591afd5713	2025-05-15 09:19:55.814
8f1532eb-2e60-4a59-bd4b-324a0193c232	4c50b4a2-4771-4d4f-b7e2-0b63fe387456	353e6507-bef6-42df-a896-da63bf55e369	2025-05-15 09:22:04.985
425c020c-a3bd-405d-b908-42e5d523e379	4c50b4a2-4771-4d4f-b7e2-0b63fe387456	08b6f566-0e45-4199-be37-0fe21af68750	2025-05-15 13:44:40.56
\.


--
-- Data for Name: Gallery; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Gallery" (id, title, description, "createdAt", "updatedAt", "userId") FROM stdin;
8	Tis the first again	test create gallery after schema change	2025-03-04 10:14:14.367	2025-03-04 10:14:14.367	4c50b4a2-4771-4d4f-b7e2-0b63fe387456
9	Another one	just anotha	2025-03-04 10:15:17.775	2025-03-04 10:15:17.775	4c50b4a2-4771-4d4f-b7e2-0b63fe387456
10	Test after refactor	THis is a gallery to test the form submit after actions refactoring	2025-04-29 03:17:45.505	2025-04-29 03:17:45.505	4c50b4a2-4771-4d4f-b7e2-0b63fe387456
11	Test for pagination	hello there, my ocd senses are tingling	2025-04-29 03:32:14.397	2025-04-29 03:32:14.397	4c50b4a2-4771-4d4f-b7e2-0b63fe387456
12	Luffy Compilation	just a compilation of luffy	2025-05-16 04:11:32.944	2025-05-16 04:11:32.944	6f37f67f-1de6-4026-97d3-0f591afd5713
13	strawhats	compilation of strawhats pictures	2025-05-18 08:17:56.546	2025-05-18 08:17:56.546	6f37f67f-1de6-4026-97d3-0f591afd5713
14	just another		2025-05-18 08:19:28.48	2025-05-18 08:19:28.48	6f37f67f-1de6-4026-97d3-0f591afd5713
\.


--
-- Data for Name: GalleryImage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GalleryImage" ("galleryId", "imageId") FROM stdin;
8	1
8	2
8	3
8	4
9	1
9	3
10	21
10	22
10	23
10	24
10	18
10	20
10	19
11	20
11	19
11	26
12	59
12	36
12	60
12	61
12	63
12	62
13	71
13	72
13	73
13	74
14	65
14	69
14	70
\.


--
-- Data for Name: Image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Image" ("userId", url, "fileName", "createdAt", id, portfolio, "profilePic", "blurDataUrl", height, width) FROM stdin;
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7442.JPG	DSC_7442.JPG	2025-05-04 03:34:22.385	43	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/AAAGDE5eaSQtOOL6/wAaHyNycG+Bd2yittEAkJqsTllsvb/Fxs7eEfoRYj3ujkEAAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7380.JPG	DSC_7380.JPG	2025-04-17 01:46:00.423	9	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/AD+F0U91nEBDWxMADABWldJllLByj61RSkwAj9X/1P//nrbHSklNOoASHvi7n68AAAAASUVORK5CYII=	2992	2000
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_8571.JPG	DSC_8571.JPG	2025-04-30 06:20:05.914	30	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMElEQVR4nGOomrLXyTnQ2MCckYGVoaZ3VWXrtNbe2Xom1gxLN51au/vMt///C4rKABz0EXRpdmiIAAAAAElFTkSuQmCC	2992	2000
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_8252.JPG	DSC_8252.JPG	2025-04-30 13:35:22.861	33	f	t	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/AFyApzNtoQBMggAFJgD/+/XR1NTEysxpZl8A3d3fzs7O6+rp8PDzeKwXQvi115UAAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_8020.JPG	DSC_8020.JPG	2025-04-30 13:40:50.489	35	f	t	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/AHdMLXdKK2k9IpZiRQD/9tBiVUn+7df/+doAtq2bBAoKlpqT5trEVwkTmBaUSZIAAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7151.JPG	DSC_7151.JPG	2025-05-04 03:24:46.388	37	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/AI6GgJmNhk5FQBQLBQCrm5To4+P19fi+rKcAbmBX6eDc3trbnIyGey0VvqnsV+0AAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7153.JPG	DSC_7153.JPG	2025-05-04 03:34:18.617	39	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/ANDEwcS9tndvZwsBAAD15+EoJifh6fD69PUA7uLdU0lGqKWoxLy8pksWdalvKkcAAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7159.JPG	DSC_7159.JPG	2025-05-04 03:34:19.407	40	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/AIaGhv39+ff29aqpqgCbm5otLSuUkpGfnp8ASkpLCAgGfHx8aWlrtNkS80qIoG8AAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7056.JPG	DSC_7056.JPG	2025-04-16 10:39:25.584	5	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMElEQVR4nGMISJoUlTrB0ztXRc2ZYebio9vWH///4/+7O58Y+Bn4TJXVczzc/E2MAVDxEE1bPUGCAAAAAElFTkSuQmCC	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7446.JPG	DSC_7446.JPG	2025-04-17 01:54:20.542	11	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMElEQVR4nGNgYApg0Eu29U/h5xNiYJBLj2zeeunex/+/vzEwSGQy8KcwyBQy+M4AANRYDBBkJZpqAAAAAElFTkSuQmCC	2992	2000
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7608.JPG	DSC_7608.JPG	2025-04-17 01:54:21.876	13	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAL0lEQVR4nGNwNTaMcXOKcXcOs7dhiHZx/P/ohouhvjATE0NBiP/swlxzFRU5fn4A4GUK4IKPLJIAAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7439.JPG	DSC_7439.JPG	2025-04-17 01:57:24.173	15	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/AJjH/3yp5WCMyD1rqAC87v9ukLlPdKNUfr4Azf//T1puAwkaSnGrsmYUMZaOeeQAAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7095.JPG	DSC_7095.JPG	2025-04-17 02:01:16.882	17	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMElEQVR4nGOYPW/Jz///Hz97ZmpjxsAnKpJbVOQd5MPAysAgKiWSkhhdX1no6mAFAFVUDiwvC9txAAAAAElFTkSuQmCC	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7490.JPG	DSC_7490.JPG	2025-04-17 02:17:13.962	19	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMElEQVR4nGPwNOS3UmFoSHX7//wQgxoXgzIDQ5qvwf93Jxh6S2MSvE1Pb572/+tZAPdJD7lm1cOvAAAAAElFTkSuQmCC	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7485.JPG	DSC_7485.JPG	2025-04-18 01:36:03.549	21	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/APT//9jk7r7F1rPE2QCaqqefkJSFMj6Nj48AfIRkZVJHJQAAUEc16HgT52WNKskAAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7079.JPG	DSC_7079.JPG	2025-04-18 03:43:48.319	24	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/AMqxms3IvrnFxYCGiQDEqJT//95pZFgAARYArZuUm4+FZ0InIwAAt08S0dCbS8YAAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7251.JPG	DSC_7251.JPG	2025-04-30 06:20:05.144	28	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMElEQVR4nGNYs3P3h///+eWUGVh5GRhERXI6psXllDgGxjIwCErpuQbnNU5OKGwFABeoDRrgDWblAAAAAElFTkSuQmCC	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7492.JPG	DSC_7492.JPG	2025-05-04 03:34:24.411	45	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMElEQVR4nGOwt7NXVVFlZuRQ0zJgeP7pe01Xr1tEWsPkuQx9k6Z5e/l0T5z96f9/APFEEAwW+U5OAAAAAElFTkSuQmCC	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7497.JPG	DSC_7497.JPG	2025-05-04 03:34:26.221	47	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/AGek5nay8IG7+pLH/wCt5/+56P/H///D+f8AABAsACE5AEJtUIG27NYWFwbyYrcAAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_1595.jpg	DSC_1595.jpg	2025-02-25 09:34:55.853	2	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMUlEQVR4nGNQVtb28Qli4WViCI3O8vCO6Jo8iyE1tyo1q+LL3/8MkfHZE6YtnzZ3PQDxuQ+A6rOO+QAAAABJRU5ErkJggg==	2992	2000
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7244.JPG	DSC_7244.JPG	2025-04-17 01:54:19.479	10	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAL0lEQVR4nGOISkv79P+/mqktA48gAwMXm1dGaV5Dd1BaMYO0hp6yuXNUbl1gUjEA+xIMIIxeE7wAAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7032.JPG	DSC_7032.JPG	2025-04-30 13:37:02.834	34	f	t	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMElEQVR4nGNYVGV2b3n6/5drA80YGOaX6xsIM5hKM4S5MDDEWDLFWvNpMjCYijMAABSeCn+/72KJAAAAAElFTkSuQmCC	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_1808.jpg	DSC_1808.jpg	2025-02-25 10:24:56.969	3	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/ABAODywoJhMSEggICQCnloKSh3yplH+fhncA//bS2Lmh0bSdkHts4cMQNhz8qb4AAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_1718.jpg	DSC_1718.jpg	2025-02-25 10:25:43.821	4	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMElEQVR4nGMQYGTQ0DJmZuZnMNBU4+MV5GHnYshKCO2pK8iOC2coyYz49eLU/z+PAYFuC+wtt9cGAAAAAElFTkSuQmCC	2607	1955
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7056.JPG	DSC_7056.JPG	2025-04-16 10:43:56.786	6	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMElEQVR4nGMISJoUlTrB0ztXRc2ZYebio9vWH///4/+7O58Y+Bn4TJXVczzc/E2MAVDxEE1bPUGCAAAAAElFTkSuQmCC	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7122.JPG	DSC_7122.JPG	2025-04-17 01:45:59.563	7	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMElEQVR4nGN4/P63c0T2hGWHX/z/z8Auo8vCwKfAJxMZkcYQnNMoIavDzyTuG5QIAEnoDT/PHAGaAAAAAElFTkSuQmCC	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7135.JPG	DSC_7135.JPG	2025-04-17 01:46:00.052	8	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/AJarxcDN3m99hff//wBubG8XGBoFCQ8qLC0A//rwXVlXlpCO5NzYgR0TTF/aCWsAAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7607.JPG	DSC_7607.JPG	2025-04-17 01:54:21.243	12	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMElEQVR4nGP4f2X9/yf7/l9Y+3RRG4O7qvykGO8EUx1Vfk4GOUEeYQYGQwVpB10NAH1nDb5sjvSUAAAAAElFTkSuQmCC	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7084.JPG	DSC_7084.JPG	2025-04-17 01:55:47.609	14	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAL0lEQVR4nGMozIn8//fL3Wtnciv7GdxsLYKDvD2d7eNTKxhEGRh0dbQlZNRVlcUBVM4NINp781oAAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7217.JPG	DSC_7217.JPG	2025-04-17 01:57:52.95	16	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/AAgEA5GRk5+foG1qbwBOUFV5fYGfo6N2eXkAlq+0sLu76vn/zf//QQ8UbF9CKA0AAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7063.JPG	DSC_7063.JPG	2025-04-17 02:08:36.675	18	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAJUlEQVR4nGPg4uJiZWVlgAA+Hh5fH/9v3/9B+ZISklaWlgwMDABXPgUdSdF2uQAAAABJRU5ErkJggg==	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_8005.JPG	DSC_8005.JPG	2025-04-18 01:30:13.396	20	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/AKD8/5/3/6j//37K/wCZuMxJTlJxfoqHn7QADBoiDwEADQEAISkwyRIRV9omVQoAAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7056.JPG	DSC_7056.JPG	2025-04-18 01:43:21.748	22	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMElEQVR4nGMISJoUlTrB0ztXRc2ZYebio9vWH///4/+7O58Y+Bn4TJXVczzc/E2MAVDxEE1bPUGCAAAAAElFTkSuQmCC	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7192.JPG	DSC_7192.JPG	2025-04-30 06:14:10.528	27	f	t	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMElEQVR4nGO4fOnUr+8vHt8762VrzVBXX9jTUrF8/nQPJxsGPkYGSwNtdxsLZRk5AJlsD+343UFRAAAAAElFTkSuQmCC	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7314.JPG	DSC_7314.JPG	2025-04-30 06:20:05.524	29	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/AN7r9uz0+vP+/qOywACitMKjsb60w9B3h5gADyAtAAYXICo1KDM/AfcUN7KmB6oAAAAASUVORK5CYII=	2000	2992
6f37f67f-1de6-4026-97d3-0f591afd5713	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/luffy.jpeg	luffy.jpeg	2025-05-03 14:07:30.841	36	f	t	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/ANC3x/br8XJcZhwAAADNtL3uzr1eRkenkIUA1rjCroNxmIyX//j/qBgWcpJaSRgAAAAASUVORK5CYII=	190	265
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7026.JPG	DSC_7026.JPG	2025-05-04 03:34:17.799	38	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAL0lEQVR4nGPI9Lfrrc4oS/IwVOJg8DZXzwgL2rtlPQOjDoOzrnhufMj3n/+8vMsA8NINiKvmzg0AAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7555.JPG	DSC_7555.JPG	2025-05-04 03:34:27	48	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMElEQVR4nGNYUpmWa2VowMBgxsDAsLIqrdHRclaQ97neaoYQQ9X/d07+v3fp//PLAP1rEQkbTeXOAAAAAElFTkSuQmCC	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7807.JPG	DSC_7807.JPG	2025-04-30 11:33:02.306	32	f	t	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/ABkZFhQOBp2amfb8/AAhHhgLBwCutbPS4uYAM0NUDAAFjHp49/38BuUPkUlUi2wAAAAASUVORK5CYII=	2992	2000
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_0762.jpg	DSC_0762.jpg	2025-02-25 09:34:55.124	1	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMElEQVR4nGO4+OT963//L9574hHgzOAXFzJ7+ZL0/GQGTgYGDS15L28XHz8PE2NtAJPkD+FgRgvYAAAAAElFTkSuQmCC	1877	2346
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7276.JPG	DSC_7276.JPG	2025-04-18 01:48:08.146	23	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/APL///P///D//+n2/wC5vsaKiI/Exc2wtsIACwMACgABGhETGhITIL8UoEm5CT4AAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7201.JPG	DSC_7201.JPG	2025-04-22 14:53:20.646	25	f	t	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/ALa4xr/BzZSbqFhkcQCmoKv/+/vR1dZkeYQAdW98//vux8W6AAMY2YMW8pYqxigAAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7201.JPG	DSC_7201.JPG	2025-04-22 14:55:54.699	26	f	t	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/ALa4xr/BzZSbqFhkcQCmoKv/+/vR1dZkeYQAdW98//vux8W6AAMY2YMW8pYqxigAAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7169.JPG	DSC_7169.JPG	2025-04-30 11:29:07.117	31	f	t	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMElEQVR4nGOIjo29cOXqj///V2/aycDKzGBrrF9ZXBgVGcWQkRbDIS7HwCna0twAAFrZDrhuqJdoAAAAAElFTkSuQmCC	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7165.JPG	DSC_7165.JPG	2025-05-04 03:34:20.287	41	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/AEBBQszS2Pb//2ludwALAwA9PTtycnMlIR4AvLavjo6Ol5WVx8DAUFoRzZss7GoAAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7293.JPG	DSC_7293.JPG	2025-05-04 03:34:21.217	42	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMElEQVR4nGP49u//kbNX1+/Yl55TxHDk3LXcwhI3NzdTc3MGDS1tYTFRQUEuNiYGAJqnDuId29cBAAAAAElFTkSuQmCC	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7468.JPG	DSC_7468.JPG	2025-05-04 03:34:23.326	44	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMElEQVR4nGOw5WcwYmDQZ2AwYWBgqIpxbMmPyfQyCTCQYth95cn3//+PXnsyefJMAK/pDm9tOxFnAAAAAElFTkSuQmCC	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_7495.JPG	DSC_7495.JPG	2025-05-04 03:34:25.318	46	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/AN3PzP/69dzLwhkXHQDcz8vx7eqyqqYJBQ8Ay7u339fTno2HHBce5CMWQxgwlyQAAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://https://dal69ajk6u7z2.cloudfront.net/uploads/DSC_7230.JPG	DSC_7230.JPG	2025-05-08 01:38:57.551	49	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/AOP//8Lg99Tu/6jF3wCivtU1VGYZM0IABxIAHTlRJkFXEyc5BhgiuqUQa+UXSmMAAAAASUVORK5CYII=	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://https://dal69ajk6u7z2.cloudfront.net/uploads/DSC_7562.JPG	DSC_7562.JPG	2025-05-08 01:38:59.051	50	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMElEQVR4nGMoDbD9/+NlQ6p/Y048Q2OQxaoEz+u7Fz8/vpJBhYGhxc/s4PxmXWkBAGb7ELTcRU9uAAAAAElFTkSuQmCC	2000	2992
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	https://https://dal69ajk6u7z2.cloudfront.net/uploads/DSC_8063.JPG	DSC_8063.JPG	2025-05-08 01:39:00.484	51	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/AAB/6GGy//b9+eXezgAAe+EvT2t0cmcoHhAAAHfeVaT5m6etFwAAkUcSLIJLdMsAAAAASUVORK5CYII=	2992	2000
08b6f566-0e45-4199-be37-0fe21af68750	https://https://dal69ajk6u7z2.cloudfront.net/uploads/Jayjo.jpg	Jayjo.jpg	2025-05-08 02:13:14.119	52	f	t	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAP0lEQVR4nAE0AMv/AP/8+nh3dTs7OtLR0ADOzstkWUNURyyCgH4AMTJBY1dL6NWy6ePhAA0PJgMAGM7IxPv18KOhGYenvSCSAAAAAElFTkSuQmCC	744	736
08b6f566-0e45-4199-be37-0fe21af68750	https://https://dal69ajk6u7z2.cloudfront.net/uploads/jayjo-2nd-bike.webp	jayjo-2nd-bike.webp	2025-05-08 02:29:44.256	53	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAP0lEQVR4nAE0AMv/AP/45M20oKCKd3BlSQDt18WEdm1SRDgnGxMAzcK30sW7DwQAIhoOAJSFeGldUpaEbzwwIqndFoQc1XuYAAAAAElFTkSuQmCC	964	1080
08b6f566-0e45-4199-be37-0fe21af68750	https://https://dal69ajk6u7z2.cloudfront.net/uploads/jayjo-2nd-bike.jpg	jayjo-2nd-bike.jpg	2025-05-08 02:30:01.142	54	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nAE0AMv/AP/45OHFrqmUf1dROQDq1sWjkYZCMytFNSsAx7qy3s7EHRcSEQAAAIZ5amhbTaGOeUQ4KLt7FxDsfGeoAAAAAElFTkSuQmCC	1147	1284
08b6f566-0e45-4199-be37-0fe21af68750	https://https://dal69ajk6u7z2.cloudfront.net/uploads/jayjo-tshirt.jpg	jayjo-tshirt.jpg	2025-05-08 07:01:13.591	55	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAECAIAAAArjXluAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAJ0lEQVR4nAEcAOP/ABEGAHlyaACqopgyJxoA/v//uLSzALSrpKSfoZEkDMRRUIjnAAAAAElFTkSuQmCC	298	169
08b6f566-0e45-4199-be37-0fe21af68750	https://https://dal69ajk6u7z2.cloudfront.net/uploads/jayjo-helmet.jpg	jayjo-helmet.jpg	2025-05-11 09:56:29.17	56	f	t	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMElEQVR4nGMQUHBnZJBLS29jkFe1d7TSE5bQZvAOyf7/+1loVBqDkpoNL5O0m2s0ALdICf/sc+l2AAAAAElFTkSuQmCC	251	201
08b6f566-0e45-4199-be37-0fe21af68750	https://https://dal69ajk6u7z2.cloudfront.net/uploads/Jayjo.jpg	Jayjo.jpg	2025-05-11 10:19:52.186	57	f	t	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAP0lEQVR4nAE0AMv/AP/8+nh3dTs7OtLR0ADOzstkWUNURyyCgH4AMTJBY1dL6NWy6ePhAA0PJgMAGM7IxPv18KOhGYenvSCSAAAAAElFTkSuQmCC	744	736
6f37f67f-1de6-4026-97d3-0f591afd5713	https://dal69ajk6u7z2.cloudfront.net/uploads/1747368418261-one-piece-luffy-iphone-yih3alkak9kavfv8.jpg	one-piece-luffy-iphone-yih3alkak9kavfv8.jpg	2025-05-16 04:07:00.215	58	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAECAIAAAArjXluAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAJUlEQVR4nGNgKN/GMOEyw93f/5XcYxn+/3w1tW8SA4Ow+dkf7wC3jw3C1g8fNAAAAABJRU5ErkJggg==	900	506
6f37f67f-1de6-4026-97d3-0f591afd5713	https://dal69ajk6u7z2.cloudfront.net/uploads/1747368502161-one-piece-luffy-iphone-yih3alkak9kavfv8.jpg	one-piece-luffy-iphone-yih3alkak9kavfv8.jpg	2025-05-16 04:08:24.888	59	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAECAIAAAArjXluAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAJUlEQVR4nGNgKN/GMOEyw93f/5XcYxn+/3w1tW8SA4Ow+dkf7wC3jw3C1g8fNAAAAABJRU5ErkJggg==	900	506
6f37f67f-1de6-4026-97d3-0f591afd5713	https://dal69ajk6u7z2.cloudfront.net/uploads/1747368502216-monkey-d-luffy-straw-hat-one-piece.jpg	monkey-d-luffy-straw-hat-one-piece.jpg	2025-05-16 04:08:25.373	60	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAI0lEQVR4nGOYFKj0/8PRD3tnV1hxMJgzMESLMj6ZlJusyQAAmJIJ03k4RiYAAAAASUVORK5CYII=	450	800
6f37f67f-1de6-4026-97d3-0f591afd5713	https://dal69ajk6u7z2.cloudfront.net/uploads/1747368502222-643508.jpg	643508.jpg	2025-05-16 04:08:26.386	61	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/AMjRxbuym243KaiNiQCjn4TkyaH/7r2UPCgACAgA7tqftrS7h3BWo10UkthNiJoAAAAASUVORK5CYII=	1466	2152
6f37f67f-1de6-4026-97d3-0f591afd5713	https://dal69ajk6u7z2.cloudfront.net/uploads/1747368502232-one_piece_luffy_new_season.webp	one_piece_luffy_new_season.webp	2025-05-16 04:08:26.982	62	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAI0lEQVR4nGM4u2PhnIrgDd3p//8/ZlBhYFYQlwwwN0lNTQUApQAKcrcbh58AAAAASUVORK5CYII=	1004	1920
6f37f67f-1de6-4026-97d3-0f591afd5713	https://dal69ajk6u7z2.cloudfront.net/uploads/1747368502252-421673_10150623706038212_51093333211_9253442_557174142_n.webp	421673_10150623706038212_51093333211_9253442_557174142_n.webp	2025-05-16 04:08:27.786	63	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAM0lEQVR4nAEoANf/AGxOXOLAs5JuaADLm3/txqD++vUAtnpvaUE4lXZgAHBGUZ9yfhwACqVoEqFm9FOfAAAAAElFTkSuQmCC	960	683
6f37f67f-1de6-4026-97d3-0f591afd5713	https://dal69ajk6u7z2.cloudfront.net/uploads/1747368502242-one-piece-luffy-putting-on-his-straw-hat.avif	one-piece-luffy-putting-on-his-straw-hat.avif	2025-05-16 04:08:28.373	64	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAI0lEQVR4nGO4cXj92pboc4uq//97yqDAwOBobuJnrF1UXAgAs0sLctGwXikAAAAASUVORK5CYII=	570	1140
6f37f67f-1de6-4026-97d3-0f591afd5713	https://dal69ajk6u7z2.cloudfront.net/uploads/421673_10150623706038212_51093333211_9253442_557174142_n.webp	421673_10150623706038212_51093333211_9253442_557174142_n.webp	2025-05-16 06:58:09.637	65	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAM0lEQVR4nAEoANf/AGxOXOLAs5JuaADLm3/txqD++vUAtnpvaUE4lXZgAHBGUZ9yfhwACqVoEqFm9FOfAAAAAElFTkSuQmCC	960	683
6f37f67f-1de6-4026-97d3-0f591afd5713	https://dal69ajk6u7z2.cloudfront.net/uploads/1747391546222-one-piece-luffy-iphone-yih3alkak9kavfv8.jpg	one-piece-luffy-iphone-yih3alkak9kavfv8.jpg	2025-05-16 10:32:28.778	66	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAECAIAAAArjXluAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAJUlEQVR4nGNgKN/GMOEyw93f/5XcYxn+/3w1tW8SA4Ow+dkf7wC3jw3C1g8fNAAAAABJRU5ErkJggg==	900	506
6f37f67f-1de6-4026-97d3-0f591afd5713	https://dal69ajk6u7z2.cloudfront.net/uploads/1747542993263-one_piece_luffy_new_season.webp	one_piece_luffy_new_season.webp	2025-05-18 04:36:35.618	67	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAI0lEQVR4nGM4u2PhnIrgDd3p//8/ZlBhYFYQlwwwN0lNTQUApQAKcrcbh58AAAAASUVORK5CYII=	1004	1920
6f37f67f-1de6-4026-97d3-0f591afd5713	https://dal69ajk6u7z2.cloudfront.net/uploads/1747555466132-monkey-d-luffy-straw-hat-one-piece.jpg	monkey-d-luffy-straw-hat-one-piece.jpg	2025-05-18 08:04:34.383	68	f	t	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAI0lEQVR4nGOYFKj0/8PRD3tnV1hxMJgzMESLMj6ZlJusyQAAmJIJ03k4RiYAAAAASUVORK5CYII=	450	800
6f37f67f-1de6-4026-97d3-0f591afd5713	https://dal69ajk6u7z2.cloudfront.net/uploads/1747555536464-one-piece-luffy-iphone-yih3alkak9kavfv8.jpg	one-piece-luffy-iphone-yih3alkak9kavfv8.jpg	2025-05-18 08:05:38.145	69	f	t	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAECAIAAAArjXluAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAJUlEQVR4nGNgKN/GMOEyw93f/5XcYxn+/3w1tW8SA4Ow+dkf7wC3jw3C1g8fNAAAAABJRU5ErkJggg==	900	506
6f37f67f-1de6-4026-97d3-0f591afd5713	https://dal69ajk6u7z2.cloudfront.net/uploads/1747555601887-luffytaro.png	luffytaro.png	2025-05-18 08:06:44.558	70	f	t	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nAE0AMv/AH7g/wADNABFhIHm/wBbsP9JOCoQHCFyzf8AeNf///3f9cCXYsT/AFiy/7MzResZCmVMhJD4GhV97zTFAAAAAElFTkSuQmCC	2000	2000
6f37f67f-1de6-4026-97d3-0f591afd5713	https://dal69ajk6u7z2.cloudfront.net/uploads/1747556138162-strawhats-round.jpg	strawhats-round.jpg	2025-05-18 08:15:41.75	71	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAECAIAAAArjXluAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAJUlEQVR4nGOQZWLISwhgUORnMFCRZpiXHX56ShHD/9eHvhxaAABb9woQA1aH4AAAAABJRU5ErkJggg==	1920	1080
6f37f67f-1de6-4026-97d3-0f591afd5713	https://dal69ajk6u7z2.cloudfront.net/uploads/1747556138136-Straw-Hat-Pirates.webp	Straw-Hat-Pirates.webp	2025-05-18 08:15:42.408	72	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAI0lEQVR4nGP48eLOs+2HXl2+8v/nO4Zcb3tfdT4bcSZZBgYA3uwMfvFQKxkAAAAASUVORK5CYII=	750	1212
6f37f67f-1de6-4026-97d3-0f591afd5713	https://dal69ajk6u7z2.cloudfront.net/uploads/1747556138156-open-mouth-luffy-team.webp	open-mouth-luffy-team.webp	2025-05-18 08:15:43.046	73	t	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAIklEQVR4nGP4//3LvLrM3sLIHXOaGfJS05gZGQIYGOpCQwGsSgpT2EZrOQAAAABJRU5ErkJggg==	529	940
6f37f67f-1de6-4026-97d3-0f591afd5713	https://dal69ajk6u7z2.cloudfront.net/uploads/1747556158562-643508.jpg	643508.jpg	2025-05-18 08:16:02.339	74	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/AMjRxbuym243KaiNiQCjn4TkyaH/7r2UPCgACAgA7tqftrS7h3BWo10UkthNiJoAAAAASUVORK5CYII=	1466	2152
6f37f67f-1de6-4026-97d3-0f591afd5713	https://dal69ajk6u7z2.cloudfront.net/uploads/1747556549210-Straw-Hat-Pirates.webp	Straw-Hat-Pirates.webp	2025-05-18 08:22:31.785	75	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAI0lEQVR4nGP48eLOs+2HXl2+8v/nO4Zcb3tfdT4bcSZZBgYA3uwMfvFQKxkAAAAASUVORK5CYII=	750	1212
6f37f67f-1de6-4026-97d3-0f591afd5713	https://dal69ajk6u7z2.cloudfront.net/uploads/1747556729608-Straw-Hat-Pirates.webp	Straw-Hat-Pirates.webp	2025-05-18 08:25:34.421	76	f	f	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAI0lEQVR4nGP48eLOs+2HXl2+8v/nO4Zcb3tfdT4bcSZZBgYA3uwMfvFQKxkAAAAASUVORK5CYII=	750	1212
\.


--
-- Data for Name: Metadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Metadata" (aperture, "focalLength", "exposureTime", iso, flash, model, height, width, id, "imageId") FROM stdin;
\N	\N	\N	\N	\N	\N	1877	2346	1	1
5.6	105	0.0025	1000	Flash did not fire, compulsory flash mode	NIKON D7100	2992	2000	2	2
5.6	105	0.00125	500	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	3	3
11	45	0.008	200	Flash did not fire, compulsory flash mode	NIKON D7100	2607	1955	4	4
5.6	18	0.1666666666666667	800	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	5	5
5.6	18	0.1666666666666667	800	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	6	6
7.1	30	0.005	200	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	7	7
10	18	0.01	200	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	8	8
11	18	0.00625	100	Flash did not fire, compulsory flash mode	NIKON D7100	2992	2000	9	9
5.6	22	0.008	250	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	10	10
10	85	0.003125	200	Flash did not fire, compulsory flash mode	NIKON D7100	2992	2000	11	11
1.8	85	0.02	100	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	12	12
1.8	85	0.02	100	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	13	13
8	18	0.06666666666666667	500	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	14	14
10	85	0.003125	200	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	15	15
5.3	75	0.01666666666666667	800	Flash did not fire, auto mode	NIKON D7100	2000	2992	16	16
11	18	0.008	125	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	17	17
3.5	18	0.125	100	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	18	18
8	85	0.02	800	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	19	19
11	18	0.008	110	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	20	20
9	85	0.01	800	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	21	21
5.6	18	0.1666666666666667	800	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	22	22
10	66	0.0125	200	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	23	23
8	26	0.05	400	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	24	24
9	105	0.03333333333333333	500	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	25	25
9	105	0.03333333333333333	500	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	26	26
9	105	0.03333333333333333	400	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	27	27
5.6	24	0.008	250	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	28	28
6.3	52	0.025	100	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	29	29
8	18	0.004	100	Flash did not fire, compulsory flash mode	NIKON D7100	2992	2000	30	30
10	70	0.01666666666666667	220	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	31	31
11	32	0.008	125	Flash did not fire, compulsory flash mode	NIKON D7100	2992	2000	32	32
8	18	0.002	100	Flash did not fire, auto mode	NIKON D7100	2000	2992	33	33
3.5	18	0.03333333333333333	1000	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	34	34
11	62	0.008	100	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	35	35
\N	\N	\N	\N	\N	\N	190	265	36	36
5.6	90	0.008	400	Flash did not fire, auto mode	NIKON D7100	2000	2992	37	37
6.3	18	0.07692307692307693	800	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	38	38
5.6	105	0.0125	400	Flash did not fire, auto mode	NIKON D7100	2000	2992	39	39
11	30	0.008	200	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	40	40
10	28	0.01666666666666667	200	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	41	41
10	35	0.01666666666666667	220	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	42	42
9	85	0.00625	400	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	43	43
7.1	85	0.04	800	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	44	44
8	85	0.02	800	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	45	45
6.3	85	0.06666666666666667	800	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	46	46
10	85	0.004	200	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	47	47
1.8	85	0.01666666666666667	100	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	48	48
6.3	50	0.00625	200	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	49	49
1.8	85	0.01666666666666667	100	Flash did not fire, compulsory flash mode	NIKON D7100	2000	2992	50	50
11	32	0.008	100	Flash did not fire, compulsory flash mode	NIKON D7100	2992	2000	51	51
\N	\N	\N	\N	\N	\N	744	736	52	52
\N	\N	\N	\N	\N	\N	964	1080	53	53
\N	\N	\N	\N	\N	\N	1147	1284	54	54
\N	\N	\N	\N	\N	\N	298	169	55	55
\N	\N	\N	\N	\N	\N	251	201	56	56
\N	\N	\N	\N	\N	\N	744	736	57	57
\N	\N	\N	\N	\N	\N	900	506	58	58
\N	\N	\N	\N	\N	\N	900	506	59	59
\N	\N	\N	\N	\N	\N	450	800	60	60
\N	\N	\N	\N	\N	\N	1466	2152	61	61
\N	\N	\N	\N	\N	\N	1004	1920	62	62
\N	\N	\N	\N	\N	\N	960	683	63	63
\N	\N	\N	\N	\N	\N	570	1140	64	64
\N	\N	\N	\N	\N	\N	960	683	65	65
\N	\N	\N	\N	\N	\N	900	506	66	66
\N	\N	\N	\N	\N	\N	1004	1920	67	67
\N	\N	\N	\N	\N	\N	450	800	68	68
\N	\N	\N	\N	\N	\N	900	506	69	69
\N	\N	\N	\N	\N	\N	2000	2000	70	70
\N	\N	\N	\N	\N	\N	1920	1080	71	71
\N	\N	\N	\N	\N	\N	750	1212	72	72
\N	\N	\N	\N	\N	\N	529	940	73	73
\N	\N	\N	\N	\N	\N	1466	2152	74	74
\N	\N	\N	\N	\N	\N	750	1212	75	75
\N	\N	\N	\N	\N	\N	750	1212	76	76
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, "emailVerified", password, "createdAt", "updatedAt", bio, "profilePic") FROM stdin;
5b40a4c5-e860-4dee-a18e-5cfaf720eac8	Test2	test2@email.com	\N	$2b$10$L0WJG0i8xX/.QwRdO0X1lOsG7K4A5b3nuvmludnUwPvW3bDa0.IpG	2025-02-18 03:53:43.291	2025-02-18 03:53:43.291	\N	\N
08b6f566-0e45-4199-be37-0fe21af68750	Jay Jo	jayjo@windbreaker.fly	\N	$2b$10$ELuXnNpgqzZD.9KoPEfDBeMNz2Sj0cUs4m8tSYgtdL9uX5JNrIxdG	2025-05-01 04:51:06.44	2025-05-11 10:19:58.241	...	https://https://dal69ajk6u7z2.cloudfront.net/uploads/Jayjo.jpg
353e6507-bef6-42df-a896-da63bf55e369	Zoro	zoro@strawhats.com	\N	$2b$10$xjGnNF/72da.sjB30kBcz.3Vv86YaY1EAmHc8sae5DjjnT6hcCzsW	2025-05-01 04:59:48.36	2025-05-11 10:22:20.301	nothing happened...	\N
4c50b4a2-4771-4d4f-b7e2-0b63fe387456	Ice Cube	rashidfirhat98@gmail.com	\N	$2b$10$OKBut74mxXAkQSzMmHEnkOYRRjasau33518tx/0YbgXYkwiyURBHW	2025-02-18 08:01:26.086	2025-05-14 04:19:34.336	floating on an iceberg. drifting in the seas	https://equifokal-dev.s3.ap-southeast-2.amazonaws.com/uploads/DSC_8020.JPG
6f37f67f-1de6-4026-97d3-0f591afd5713	Luffytaro	luffy@strawhats.com	\N	$2b$10$AqRI122cjIKznAIzpBmUye2NEDAQ6J5XPS65enJFi.Pudmog/Lf0G	2025-02-24 09:08:42.563	2025-05-18 08:06:44.604	ore wa kaizoku ou ni naru	https://dal69ajk6u7z2.cloudfront.net/uploads/1747555601887-luffytaro.png
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
75c10676-817e-4be3-96bc-6aa20079ba50	f052bdb3a1259fc6567785e205162848b667e376a1489813707b2224ea83f0f7	2025-02-18 11:43:32.217966+08	20250206154853_init	\N	\N	2025-02-18 11:43:32.203655+08	1
5aab1679-9282-4a83-b8b0-01d0034b3fb3	623565071b0e668202114b153c294419798c85ece4dcde5f5285008886b6fb4e	2025-02-24 16:40:28.892019+08	20250224083808_migrate_to_uuid	\N	\N	2025-02-24 16:40:28.862133+08	1
764f5ada-3076-4872-8330-ef63016b1555	77644b657c8a56877e584ccbc8ed186f97a953408113486a20fbca9ea65385bd	2025-04-18 11:17:32.562031+08	20250418031732_add_desc_column_article	\N	\N	2025-04-18 11:17:32.556463+08	1
554f3f2e-afac-466d-a0ee-e734b28c8496	6e5e292b73f91b155b0cfcdf160fd833c0db049f0b28338a7b6f1fff5692b2df	2025-02-24 16:43:18.132538+08	20250224084318_add_image_and_metadata_model	\N	\N	2025-02-24 16:43:18.121559+08	1
bbdef86d-9b30-4006-8152-530933b16308	aa73673562ffd4ed0773849c84ba20aca273576b1de185a8ab601ba519697480	2025-02-24 16:48:58.541814+08	20250224084858_change_metadata_flash_column_type	\N	\N	2025-02-24 16:48:58.535383+08	1
a45983fd-904d-4437-9169-9a47c7249835	40a561b1c245b72eb8344543445778221975f444515c5e64fce23b57261bffc6	2025-02-24 18:28:17.403718+08	20250224102817_fix_metadata_relation	\N	\N	2025-02-24 18:28:17.395887+08	1
7ad9e3c2-7a23-4436-b6cd-9c2089bd970e	7baec699a5ab54eaacd6e615cb84fa5650fff848b27454058a5d8068648a59e5	2025-04-19 12:05:16.022572+08	20250419040515_add_profile_pic_flag	\N	\N	2025-04-19 12:05:16.007044+08	1
1ba31ff6-7193-4f7e-84c6-c423126070d1	0af024c46b8bbe201f023b7e31be798716cb59985cc2abb5f76e60e021cdf023	2025-02-24 18:30:07.443436+08	20250224103007_add_column_model_metadata	\N	\N	2025-02-24 18:30:07.439278+08	1
a46dfd72-c32c-4c82-bb4c-f6bb54abd406	ec472b23a9e0c35e793202a3d6cc883364a689f54e919d661f8462e74e8e69ea	2025-02-25 17:28:32.642848+08	20250225092832_add_column_metadata_width_and_height	\N	\N	2025-02-25 17:28:32.619063+08	1
d0ac494b-4137-4744-988c-430cc6d0bd16	eed3ea6fd4338c4a3ec0ad28fcc74a5fb7c08b4d1e41dd4b6eb9b310df6c134c	2025-02-27 19:17:10.012402+08	20250227111709_add_gallery	\N	\N	2025-02-27 19:17:09.991858+08	1
7d5746b5-0ead-485e-863c-cb87671b104c	c9166b5f2599415ccfcd9b465ca075ea4e853a4ec738b9a6211de5e83e36a818	2025-04-26 15:56:52.350494+08	20250426075652_add_follow_table	\N	\N	2025-04-26 15:56:52.332732+08	1
6d274168-2ef4-412d-be73-83fac5f0a690	fe20538671561d5ab68f04ff57526cfb80c8bf049bda6ea11c03074cec383bac	2025-02-28 18:36:42.409683+08	20250228103642_add_gallery_image_relationship	\N	\N	2025-02-28 18:36:42.394857+08	1
2ceae723-4cd6-48db-9931-58d7f438df3a	3171d712686844905aadb8ac8deba1d078bda07bab82db41034c111bef89d041	2025-03-04 17:46:25.188408+08	20250304094625_add_article_table	\N	\N	2025-03-04 17:46:25.169697+08	1
66ce4f13-ea07-46aa-9068-a9be08116870	3dbe4fe52939fb6c5ca4da987f9af071ada226ddf9b9d0f6826d2b5e2aa488ca	2025-04-08 18:10:47.604558+08	20250408101047_add_cover_image_to_article	\N	\N	2025-04-08 18:10:47.593374+08	1
70bc2a74-c10b-4738-8b0d-23309273f7bb	e1f8bb71a4623bdc3c54d065f4b79815258e36277a84bc423751dd346aa0553d	2025-05-07 11:23:17.82034+08	20250507032317_add_blur_data_url	\N	\N	2025-05-07 11:23:17.813635+08	1
a75974e7-7f91-4efd-bcc5-4a4fe031cdbf	66c53372e72b0fa8d4b47c13041cae425a68e92ad5c083cbd27b6f007b520f59	2025-04-10 16:13:50.898147+08	20250410081350_add_portfolio_flag	\N	\N	2025-04-10 16:13:50.889875+08	1
718b341a-262f-489e-a1b5-d3cf18b8c3ef	86ea5a795248af95982e6318eed5f85ec6f6e2313d580ad87550adc9ec99efbd	2025-04-18 11:16:31.543907+08	20250418031547_add_desc_column	\N	\N	2025-04-18 11:16:31.53399+08	1
311bb415-d7c0-401e-8377-efd2c6666c2d	ec7cea54a18de0638b3e8c340b87fb8cba6c1bcf27769e8ec28d7e51e85df11d	2025-05-07 22:28:32.130117+08	20250507142831_add_image_index	\N	\N	2025-05-07 22:28:32.117935+08	1
031c25bf-a0cf-44ed-8519-d2260731d84d	47b2df44e2fd25e51dac94c72395d5558b7c4b731cf8f5b22cd09ec8d026cb41	2025-05-08 12:30:59.657916+08	20250508043059_add_width_height_to_image	\N	\N	2025-05-08 12:30:59.648929+08	1
a26055ae-2eaf-4ec8-8773-03dc8fd459f7	bf3d66103d6834527bbecc908a1aac65294509312094f3c6dfeb19506b93875b	2025-05-08 14:23:33.637335+08	20250508062333_add_column_indeces	\N	\N	2025-05-08 14:23:33.621228+08	1
\.


--
-- Name: ArticleGallery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ArticleGallery_id_seq"', 13, true);


--
-- Name: Article_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Article_id_seq"', 21, true);


--
-- Name: Gallery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Gallery_id_seq"', 14, true);


--
-- Name: Image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Image_id_seq"', 76, true);


--
-- Name: Metadata_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Metadata_id_seq"', 76, true);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: ArticleGallery ArticleGallery_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ArticleGallery"
    ADD CONSTRAINT "ArticleGallery_pkey" PRIMARY KEY (id);


--
-- Name: Article Article_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_pkey" PRIMARY KEY (id);


--
-- Name: Follow Follow_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_pkey" PRIMARY KEY (id);


--
-- Name: GalleryImage GalleryImage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GalleryImage"
    ADD CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("galleryId", "imageId");


--
-- Name: Gallery Gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Gallery"
    ADD CONSTRAINT "Gallery_pkey" PRIMARY KEY (id);


--
-- Name: Image Image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Image"
    ADD CONSTRAINT "Image_pkey" PRIMARY KEY (id);


--
-- Name: Metadata Metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Metadata"
    ADD CONSTRAINT "Metadata_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: ArticleGallery_articleId_galleryId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ArticleGallery_articleId_galleryId_key" ON public."ArticleGallery" USING btree ("articleId", "galleryId");


--
-- Name: ArticleGallery_articleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ArticleGallery_articleId_idx" ON public."ArticleGallery" USING btree ("articleId");


--
-- Name: ArticleGallery_galleryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ArticleGallery_galleryId_idx" ON public."ArticleGallery" USING btree ("galleryId");


--
-- Name: Article_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Article_userId_idx" ON public."Article" USING btree ("userId");


--
-- Name: Follow_followerId_followingId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON public."Follow" USING btree ("followerId", "followingId");


--
-- Name: Follow_followerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Follow_followerId_idx" ON public."Follow" USING btree ("followerId");


--
-- Name: Follow_followingId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Follow_followingId_idx" ON public."Follow" USING btree ("followingId");


--
-- Name: GalleryImage_galleryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "GalleryImage_galleryId_idx" ON public."GalleryImage" USING btree ("galleryId");


--
-- Name: GalleryImage_imageId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "GalleryImage_imageId_idx" ON public."GalleryImage" USING btree ("imageId");


--
-- Name: Gallery_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Gallery_userId_idx" ON public."Gallery" USING btree ("userId");


--
-- Name: Image_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Image_userId_idx" ON public."Image" USING btree ("userId");


--
-- Name: Image_userId_portfolio_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Image_userId_portfolio_idx" ON public."Image" USING btree ("userId", portfolio);


--
-- Name: Metadata_imageId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Metadata_imageId_key" ON public."Metadata" USING btree ("imageId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ArticleGallery ArticleGallery_articleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ArticleGallery"
    ADD CONSTRAINT "ArticleGallery_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES public."Article"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ArticleGallery ArticleGallery_galleryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ArticleGallery"
    ADD CONSTRAINT "ArticleGallery_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES public."Gallery"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Article Article_coverImageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES public."Image"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Article Article_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Follow Follow_followerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Follow Follow_followingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GalleryImage GalleryImage_galleryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GalleryImage"
    ADD CONSTRAINT "GalleryImage_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES public."Gallery"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GalleryImage GalleryImage_imageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GalleryImage"
    ADD CONSTRAINT "GalleryImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES public."Image"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Gallery Gallery_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Gallery"
    ADD CONSTRAINT "Gallery_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Image Image_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Image"
    ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Metadata Metadata_imageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Metadata"
    ADD CONSTRAINT "Metadata_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES public."Image"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

