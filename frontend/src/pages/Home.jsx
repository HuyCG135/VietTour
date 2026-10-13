import HomeHero from "../features/home/sections/HomeHero";
import WhyChooseUs from "../features/home/sections/WhyChooseUs";
import HomeTours from "../features/home/sections/HomeTours";
import HomeReviews from "../features/home/sections/HomeReviews";

export default function Home() {
    return (
        <>
            <HomeHero />
            <WhyChooseUs />
            <HomeTours />
            <HomeReviews />
        </>
    );
}