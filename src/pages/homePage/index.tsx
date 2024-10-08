import React,{useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,  faHome, faInfoCircle, faDollar, faPhone, faSignInAlt, faUserPlus, faComment, faStar, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const popularRoutes = [
    {
      name: "Allepey house boat",
      image:
        "https://www.ekeralatourism.net/wp-content/uploads/2018/03/Alleppey.jpg",
      description:
        "Alappuzha is a prominent tourist destination in Kerala. The town is famous for its waterways and backwaters, and has been described as the Venice of the East.",
    },
    {
      name: "Munnar",
      image: "https://static.toiimg.com/photo/58490365.cms",
      description:
        "Munnar is situated at the confluence of three mountain streams – Muthirapuzha, Nallathanni and Kundala – and the word 'Munnar' means three rivers in Malayalam.",
    },
    {
      name: "Palakkad",
      image:
        "https://keralatourism.travel/images/destinations/headers/palakkad-kerala-tourism-entry-fee-timings-holidays-reviews-header.jpg",
      description:
        "Palakkad is in the central region of Kerala, bordered by the Malappuram, Thrissur, Nilgiris, and Coimbatore districts. It's about 216 miles northeast of the state capital, Thiruvananthapuram.",
    },
    {
      name: "Jadayu para",
      image:
        "https://www.tripsavvy.com/thmb/_3Tm8T8GU_-9LlD4PsPb3orHjlc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Jatayu-National-Park-Kerala-1024x512_Snapseed-5aafa43eff1b780036c19082.jpg",
      description:
        "Jatayu Earth Center, also known as Jatayu Nature Park or Jatayu Rock, is a park and tourism centre at Chadayamangalam in Kollam district of Kerala, India.",
    },
    {
      name: "Trivandrum",
      image:
        "https://resources.thomascook.in/images/holidays/staticPage/ThingsToDo/trivandrum5.jpg",
      description:
        "Thiruvananthapuram, formerly known as Trivandrum, is the capital city of the Indian state of Kerala.",
    },
  ];
  const vehicleTypes = [
    {
      title: "Luxury",
      description: "Luxury vehicles for a premium experience",
      price: "2000",
      image: "https://cheetah.cherishx.com/uploads/145675798898155.jpg",
    },
    {
      title: "Premium",
      description: "Comfortable rides for everyday travel",
      price: "1000",
      image:
        "https://stimg.cardekho.com/images/carexteriorimages/930x620/Tata/Harrier/9368/1697532960290/front-left-side-47.jpg",
    },
    {
      title: "Sedan",
      description: "Comfortable rides for everyday travel",
      price: "1000",
      image:
        " data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUSExIWFhUXFRcYGBcYFxoeFhcYFxcdHRgVFxgYHyggGBolHRcXITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGBAQGi0dHR0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tKzcrLS0tLf/AABEIAKABOwMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAFAgMEBgcBAAj/xABNEAACAAMEBgYGBggCCAcAAAABAgADEQQSITEFBkFRYXETIoGRofAHMkKxwdEUUmJykuEjM0NTgqKy8RXSFjRUY3OTwvIXJESDlMPi/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/xAAhEQEBAQACAwACAwEAAAAAAAAAARECMQMSIVFhEzJxQf/aAAwDAQACEQMRAD8AD6FsyzJhDAMAhahYqMCuZBwwJg7ZbBZy6r0cnEgUvOxqTkOtSA2ragzTljLYYi8MxgVpiKCLUrqGUF1BDCpEoV2baYbDWOXjk9fr0+a8vb5qjXgcuPnAR3HzWGkrQYbBsb5w4G4Hu/OOFeudPAeaeGJhIz+NB3x0HzQQm9j/ANsRUJ/WOzrZ3hhnw80ho8t+N5ceGUPzMCeYwvD5eaw2ScsdvtDvyjTNMnuywquPh2xxjw34dXDw80h1jzyHtDdyjga8cMcWyYHZlTu740yjtvw2fVwhJ7Nv1cYm/QplP1beduXmsI6BjgEJzwGyvZFxNQG85RN0U3rY/VyIG+F/4dN2SnIw9k/KJWjdHTRerLmLlsIrn9mFnwl+hZXzWElfNYIPo+YM5b9x+UMTJBGdRzw98ERCPNYNaAPVXmf6jArDf4wU0J6q8z/UY3wcvJ0sqNDobEdvwiLLMR9Jk0WjMvWzViDkcKiOjzjCmHaxW5chv3s3/mv84UbOfrzDzmP84aYcWdNJf9MwAmOAAEwAY0Hq1ygtq6W6XGYzdQ4E4ZjGkdsYoi/dHuz5wR0aev2H4RAUj0ejkVDNs9RuUA3g5bPUblANoKpGtv8ArA2/o1wug4XmriYBlOezJBxxwMHdbR/5gZfq1zJzvNSK+wGFQvD1sqmu3fGK9HHotScfX/DuB47Y5MrQfrNv1hnTDAeawhaCvq7PrfVN3bHGpQert+vnhX4QXDtlH6SVnk+ee3OLNY9kVqyD9JK5N5xizWOO0eTl2JSxDkISFwRXdaVBeVXLre0BtG+A0hQSKgDAA9dcFu0Jz3YwZ1oK35V67ShrUY0qK0gLLYA1LLgBXqD1aDDHgQI48u3s8f8AWFyqYkhQfvDIqb23ZHqJuA7f/wBw2rrT1hXfcXIKbwod8N31+uP+WkZdP9X3QU1VnBmKhbrg1OGKnPrHyYsb6Qs9QS8okZdY7DgIpgHH3/5Y9Xj5/DGOPOyYvLx+10qagDMAQQCaGgxAOBzjwA4fy+cI8D5qP8sKC+ar8ow6T48o4D+WFKvLvWJui9FzZ7XJSFzhWhFF4saUHbF80LqnIs46W0sJjLjTDokptNaX+3DhtjXHha5+Tyzh2qOiNSLVaOtdEuW1CHdhUjeqgEkc6A4YwZTVPR8k3Zs2ZaHGapUKK5VEoF1B31pjEbWrX95tUstVl1xmH1pnBNyk4XuNRsaK3L1itUtAoWWqjcpvsTizG+TiTUkkZmPROHGPHy83Pl18X2R9HT9VYJa0yZ1RyeN8tfHasS107PX9nLUD6s0jw6A++MyOtE45zxXd1P8ApAMQ9J60zxKK9Keucxg4C4mhBwyAO+saljlfb/rVk1wmhgoBqxIGIIF0dZj1RhWi8+cTpetTe2tRvK0HYJZmM34RGEyNPzkCsJz3ipxNGN0n1euGoKqDhE86wT7uNocnYAVqexQPIjVsTK3ey6Ys8ytQFpmQQQBva7jLH3wsETZFIquMfNqaxWq8KWiaGGIyvA71I6yniI0TUjX8grKtGBNBepdDcbmAVvugKa5A1LNVcrfp+xyHMubMKOMSplzThStaqhBFNoPjAptfdGfv2P8A7U74pBDXfQItln6SVjNVSVp+0Q4mX8Rx5mMNtdhC9ahpuGfGg7D24QRr/wDphotwesW4dExP4StTECZrNoQ5ov8A8fH+iM5mSJUgCqhplKmpN1O7M+ecRbZKmGk1M/2gwI3V2ERFaYdN6EbaRylzR7qQmbN0PMwE0rQ1wWfXxVhGa6c0fLluOjvFGWoZiDXE7RTu94gdLmFTnh7oi61g6MsLfq7ZT74+YSI0/QTfspsmbwSYt7uYjwJiqaFkvNU5rTJmUlWruxB3d8dtM60Sj6iuPsVJ/Cce6sT4ey4SNHzQqqUINAMcu/KJlis7K+O4xndi1iQMbrvJZj1itbjHaXlkXWOGeDcYsmiNNBHrONEINJi1MuppiwxaX21H2ouGxb49CUcEAgggioINQRvBGYhURozbPUblARoNWv1DygM0BSdbf9YH/DXaMOs2PndAAkjb488IsGtn6/L9mvsg+02FTADGlOVeouJxxjD0ceoQhOy9yvcDjlsjpqQPW2+1yocttfCODz1RuxjpbLEfhAwoKbOcFO2X15f8Wfzix2Q4xW5TqrISyjnhnu2f3gzZrYmHXX8QjtHjvY6phdYgpahsIPaIWbRwPYIAZrCT0ksgOaCtF+9t7oEykYGv6U0unbjl1fHwidpti0xKAVAwvXh7WG6B0uSKigQnq06x9aowzyrWOPLt7PF/UsK1KVm7822BsMttYSpf/e95+UNy5YpktODbbpptjq2cHYv4/wA4w6LOoHmn+aPAecfnDhXzj8om6HsImzVQ1CmtSAhNAK4BqCvbvNDSOUjppOjtGTZzFZa3iBUgEig5sabouegtR8A9pYjb0at/Uw+HfB7V3R1lkpWSSa5sy9Y02HKg4AUg4JyHb4GPTw8Unbx+TzW/IiSkSWvRy0CKNiig58TxMZV6VNOTjM+jKCstaE/7w0rjvUHZwjYugRsjATWXVSVa0uzB1gOq4wZeR3cMR7x1eevn6RNxrMLMTXbtGWeyIFudmbHZwHwjQtJ+jK2KTcVZo2AMFcjiCCo/FFZtuqdrl+vZJ38NH7+jBgK5IYhgabeHxhekpt5ureIAFK4mpzy7oenSAputeVtqkYjmDQiGZMrrrl61ewY/CAVOmUZgMlAUYD2Rvz2QkOroAxN4E44UIp74XQEMSO0YHMdh27K8YQ8oDb8IBcq2stVPWGXGJdnlS2PrtTA0BxHfWLNoj0V6QnS1mlZcpWFQJzlZlNhKKpI5Gh4QU/8AB61AVE+QzbgzjxuRKLH6OtbcpExsAMGJ3e1w47ML2GMOa/6vrLf6Si/o5jC/TJJpPrH7L+DfejM51lnWSdddWlzUIOOY3EEYEHeMDGw6nacl22zdFOWodGWh9oDBlB3jMbaFTsJiRaxPSt5WZWzvEnkcR54RAVcaDE7hF11t1eaTNaQ5NVxlvT9ZLOTHiMjxB4VrDypvqykdUyLBTfYbSTn2AiN4zqy6IsAawuJqiqsxUUq4AAagpiPaw4xV7bZChzqpxVt/DnB3V3SsyzqJTyW6OpJIU3gWJJvVwYVPDDflA+RcvPZ71VDHo220BqueNaUPeIzlSUS1btl6UU2oe9Tl3Go5AQTaYT7Pjwz4RV9FzDJtAByNVPJsvGmMWVyKHnjjjGLPqhel9GS3xIH3h60CrNLnyT1KutKlc8MKkr2jKLQGyw2ZQuwSAJhIyuns6wiy4XpA0FpUjGzuFJxaS+Mpt5UeyeIp2xcdFaclzj0ZBlzf3bZnijZOPHhFX0noNHN9epMzvDI/eHxGPOIku0VIk2paMPVf3MG+PfGplScsaDa/UPKAzRBk6ZmSR0dpJeUcFngEsNwmAYtzGP3iaAg1MwQwOTKaqw3g7REx0l2KNrbT6QMq9GtK1zvNugDhhWnjlU1ixa2V+kbf1a7abTjSAQBwwJ7jvwyjFeidQ0Pl7VNmGcLCmlBxPrrnQVwGcKuHHA5D2Ru+ELUHDCmfsLsAr3wVDnSHJ/ZkAYXr1accIStmf93IPY8ELwx9XtAyoajCOArUVu7Mi+VOHCL7MfxRB+jv/s8k8jT3tCTZztsqf8wD4wQFNtynVrS/lQU7aR1aXcgd5vU5esecPY/in5MWGQQMEudbYFmdta4cuEOKMcBSt0D9EmBqMa9h74dmqCRXDEg/pE6uOQz2kwlZZJ2ioUGkxcBVccBwHfGb9deMyYjS3FCby0+4udDTIRIs8+UFAa6WxyXjhs3UhMu+BX9LXKgcnMZ4CJVntLKoBlzjnjdO+IvbRm0ZK+oRyY/EwS0ZoYNKKfsyzVY+uSQnVW7TDqA4wsyInWQlVHM++NcZNeblyuJmh9HS7OnRylotSxxqWY5sTvwHcAMoIvLOYPhUfPxgY1sujLGOWPTqsaVVgMyprTmKmOjmm/T2QgFL2OakYcaGJFl0yoqGv4HElfCowI4xCtVDiMQYjq8VFil6QlNkwh68jClQRu/IxVyAcwDHVFMmYcjh3GIYsFr0ZKmi66Bl3bPCK1avRrYGNRJCnYF6qjsShPfEj6XNXJg3MUPeIWulzhMYTVANKK1RWv1cS3nKGisaQ9E0pgRLmuPvEEDkLte9zAix+jm02a0SpwuzUlsGulTeJXEFVS+DQ0OJGUaZK06u3DmCPyiZL0gjfljFFXk61F8LrEjOisac6DCFTdZJa4zGCffN3+qkWG12Oyzv1sqU/wB9FY97DCK3rlqxZTYrQZcoKyyndbhYdZBeHVBofVpltgKx6QrRZbVZ7wmoZ0si5ddSzBmo0ugqSMS3Ajia1vU60TJL9VJty8t66jsVYYCaBQ440IwDCIuo9otJtEvopbTgHFSBVVGRDMcAtCc43QWWmSr2AD3CAD6esC2+y4UFolVKY5NQFpZJobrC6RWmaGMwlm1S2FLLNYqQVPRvXDGjC6QTvjaUwzrSv9/GsTJV05P40glkrGJ+mba6lf8ADMxQkWaZe53gtQYH/Q7Y1CNH2jtkzj/9cb19HNaihBzB96nZyyPDEnvQLtFPPdF2p6xg0/QlsmUf/D5wYYEGTMGW0VWHpehNJn/0kztVvjG5GybmIhJsrbKGIuRiS6v6U/2U93zMSZOgNLLiLN/NL+LxsZQjNO2kcFIGRkP+AaYOUlRzaV/nhm1apaWmLdeRJI2EvLqDvFHwMbLc4wlkiLkZFYtU9KqhQpIZSKXXYEUOzA5QvROqGkZBI/QFCalDNYAV+qbhIOyuOQrWkasUhsy4pIzLTeotpmzL6vJpdAoxauBP2Dv3wDtGoFuXKUjcVdfdUHwjZzLhJldnKM+rpOdj5/tWg50onpJLp96XMCnqmtGK0PYYiTLNTMAYb6bMM4+i6Hn4RFn6Pkv6yUPDD3YHtierU8v6fPwBxFTn+8XZXDzujt1hT1ziDgb1cMsMI2y2aqofVVHG50UnvpQ9wgDatASVNHs0tTn6ijtBGfMRLxbnkjMGlMMTfphmnDiaQzhTEgb6oornTKNIOrdk2Sacmce5oR/ovZ9gmDlNf5xMq+/Fns1lriUOJrgc+xRthFwVxCZLexfLq8vsxoDapyv3s/tdSO4rjEVtTF2Tj/FKQ155cO6Jla9+P5UYAUySuNetspxaJNmmuFAWWpGON7jj7W+LO2pb7J0o55yruGGHVMNLqjaBgHkU5zPlDK17cfy0JNJqf1kh0PFVp3gw+jimGWY5HGIJnn+xIPuhct4vGWdvLyxnnpQ1gczPoiEhQoMymblsk+6BQ8SeEU2wdJJYTZblHGRX3HYRwOBiRpW0B7ZPmTKkdM9aZ3VYig7AB2xGnO6zSlL3XKXdjY0AG6uFOcdWG26oae+lWcMRR1N11+q4GNPskEMOcE+mFcYzHUO29DbGk3qq95KjEFpdWRq5eqHHaN0aRaFriIglB4UHgWs0iH0tO+IuJ16OQwsyFh4IkXobMpTspyw90Nh4VfgFi+Mph7cffDcy0TdtDywMKvQljASLLb7vrAjxgpJ0suwj448DASW0KdVJFQM/+k/GkXRZPpSEUIhkkVwgTIlAZV7z84fNtVdteUAVlvDonGAyaTG4xMkWtWyPzi6ggs0cocV9xiDfiDpnSjSJfSBL/WANWuqoPtM1DQVoMs2FaCpAH+lIhLMDmIrNj1tUsVeTNRhs6h7qspI7II/43Kpfqbu0FGw4rQeG3ZjmBIyl2YQgymGRrDFk0pZ5uMqfKmf8OYjf0kxLIMA1eO0R6gMLJhJWASZcJMuHI7AMFISZcSCITdgIplkZd2yEvdcXXUHgffElsM8IjTZ8vbMQc2Ue8wAm26FUHqmlcto5HaOcALY3RNcmEKeORG8HaIuBnjLrEbwjEd6giB2m7AJ8oqVoQCVY4UNMCKVPMGkSxqVW1tSH2lPaIcExd8Vt7Pw/I7RDfRcIy0tRPCPYRVRUbSO0x0zX+u3eYirNnl3w5MmCoI3DvAp8IYLGEmvnODLHNMSys+eNonzfBz+UJE0hhMukMEF3Ii+FuqwPCl6u9eMHtbrCiWmYXV3vhZiKpCirXgwZiDhVK4Y9anGAWj5iC8sxbqONlTdukUGJrQYE7cOMbZe0Da+jmynBwlzUNeAYFuwi8O2N4U7I+f7VZXl1R1ANMCPVcEYODkRxHvjc9E2npJUt/ry0b8Sg/GFDs+XDFYJXKxHm2aMqjrMoYkJaN8Rnlkd/whNYKIrMBhVYHBocSeYqYnXo9eiMs6Fh4B1Whav1hyJ7qD4wxej1/HkPf/2wRItVqABxoAKknKgzqd0Ztp/0k3WKWVFYDDpHrdP3EBFRxJ7IjelHWI1+hy2oKAzSNpOKy+VMTvqIz+RLriewb4sgt0r0iW4Gt+W3AyxT+Wh8Yt+rXpElTSJdoUSXOTg/oieJOMs86jjGaypByAFfq4V7s/CEzJOeFDF+I+krNazkYlOykUahBBBBxBBzFNo4RkHo11la8LFOY5foSc8BjJJ3UFV5EV9URqMiZh5x5xFB59ieQSFR5silUKdadK+wV9aYg9kipAwOVTAsduYFuhdSQSDcJRwaZOjVBOINCu2LeswQqfZ5M2gmykmUyvqCR90kVHZAVuz26yzOrbLHLc4AtcDMa5HrVr+UR5dlkF3SWrSgD1TKeYhpU0HUYDCmykWQ6rWc/q3nSq49WZfHYs4OByFIhrq3PkXzJeTNDGpSYhlknaS6llryRaRqIGdDaUHUtdoA3mYZneZwfhnDknTFslEdJNM5RmpWUrMN6uiDHhtyqM4RbptrQVOj5w3iVMWcnNSCswfnTCpqBnaelBrsyZMksdk6UR4IqDtLRfiNEsOl0nIWlEsRmpdgyn6rAk3eeRzFRAS06/SpNfpFntUihoS9bvYysQw4gkRS+ie901ntSFhWhL4U3EIrlgcMzx2CCUvXYyqLPvyn4VZDxQrWu+lMIyqxSfSLo5v200cxNp35Q+uueimztMk/fpX+aK0dL2K0+stmnH7UuWX8ReERbRoHRrkk2e6Ttlzpi9ylio7oaLzK1l0cfVtMjsIh1tZrEB/rcoD74jLLTqJY2/V2mfLP21lzB3L0Z8YCaU1UayI01WS0pSjEKUmSwTi1xrwpxBNDSopAa1btfdGICTa0amxKsewARXrJrNM0nOuSVaTY5TB50w4PMuEMJWGChqYjO7gaVAjO9EavvanWWCRe6I3sMFJ6xH8AmNzRd+No9I2mZVikLo2yAJVQZlDiAcSCcyT35ndA/SdZLetqtE2Wi49GbQrA4MrTaXabDRlYb6muyFvZ+ECvRJZCZs6eTULIEs/ZqZRRT/AuH3Tugpa7FMZ2ZCq1YnPKpqQaDOOfL43xukPJ7oSFG4d8eay2kZdbHK+uXb2ZwkpaPqN3L8BGdaxYmKD2WP8AEv8Al+MMT7ai5oP4mbwukbomzZsl/WUod6Zc6bO6Ik7RBmAiWwfhUAjs+caYtUjXO0S5rSmVR1bykLeBNaEYkk/WGeZilaQQIqlDUdJMCneFWWPnGh6a1ZehwYbq4Y7waUw+EU3SLzpYCzJN0pWj3DTrZkEdU5A41xjUqBdsnNRVJNEW6oOagktd7L1OyNB1U1xsyyJUqZM6N0RUN4G6buAN7KlAM4zGdNLGuJ98NgHdFH0xYSzoHUK6kYMjKRThSq+EPlhkTQ7nBX+YVB7hHznonTdpsxrInPL4KeqeanA90XPRnpYtS0E+VLnLyut4VBPZDBq02yVFbpI3jrDsu18YhvZa5UPI190V3RnpI0fMIvdLZm30qv4krQRbLFpKXPF6VOk2gcCLw5EYgxAMeQRDRWDsxU2h0PHrL2n1u4w01hveqVf7po34Wy74mLoPehSzIkT7JdzBWmdcAO3I9hiM8giCnVmx7pBUk5UFeQJiKSYj21z0c2mfRNTndaAxLSlsM+c805zHLcqmoHYKDsib9FZbP0woatdNDiqkYA7r3uu7zAqUtSBwgtYbUqswavROLjjcvszFptU0PfvjbIbNFDwIPuiy26YhKSjXplkoSx9trl5kP2rtCDtxGcDE0abwSZUUdQSKUKEm84O0UU98Q5lpZ5pmk3WZyw+zjXDlgBygJrOVKzEN1lIZSKYMDUEcQQDG56uaXFps8qeML69YfVcYOvIMDThSMMtAozClNtDhSuNOFMovfok0jhPs5ORE1eR6r9lRL7zCjTr8e6SGA0drEEuXa2GRiSukm3Dx+cDKw+giggukt6+MKmW1WFGSo3GhHcYC2/TVls/62ciHcWAY8hmeyK/bPSZYUrd6SYR9VCP67sEWG16t6NnetY0BrWqLcNd/6MjGBNv9HFlmghJ9oQH2S19BTLqmhzA9rZA/Q/pAmWuaJVnshpm7uwARd5Chqk5AVx5AkWcWiftmAfdWniSYDO9YPRVaEls8l0n3RW5dKzCPsqahjwvAnZU4RQE0lPlYLNdaYEE1AI2UYUB4ER9BNaHAqZr9rUHhSMD1w0wtotc2cg6rNgdrBVC3zxale2Am6O1zdWpNFV+suDDiRkeykXexaWluoYOrKRnUUO8GvdQxkMoBq1ehwoAta78a4EQe0ZoNWlpMa1OnSFwqJLZ2IQgFiAVUCppnshgv0rWKy2NWdEW/dpVnZz91QxwBIGAzoK5Rkukre8+a82Yau7FjzOzswHZFsTVqSfYtLZeuyS72+mDZZ5xLsmhpAdFFlkipAN+0TGa7gWIVCATdNe6L9Ur0aa0NZ5k6SyVE5EABNADLvdbnRvARdLIzst6YRevNWmXrEA9op3xjeirXdnSzsJA7zvjaZDEqpwxAPhHPm1xdNf7wnrQu6YRRo5tn7sJKnjC6HhHbvGNsGLpMJMk5UPdEm7xPnjDoMRQS06HR85Knj1a+JqYg2jVKUwyu+fO2LQQI4V3eMNTGe27Uk+waxXbbq7MTZGwlfP5w3Ns4YYgERfYxh0yyMNkMi8pvAkEZEYEdoxEbLbNX5T16tIr2kNTRiVxjXsmK3ozXrSEigW0M6j2ZgDjvbHxizWD0qg4Wiyj70pqH8LfOK1btV5i+yfO2A0/RjrmDD4jadGa/WOZQLarh+rOF3uY9XuMHFtEtxeuKQfaltnxJU498fNzSiNkLstrmyjWXMdDvRivugPoppMtsnp94DuF2gHbWI76MauQINBga7+A3xjlj19tqes6zR9tcfxLQxY9G+kuWcJ0t5dcLyG8KHMnIjsrEVnslaTKVBoaVGRo2YjhGRqB2w3KajCDVoscmSl+YRMaZ1pctajqnENMOajgMTTPOmkMWCQs00LHAXiTkoTICpoQfqkbBQ5wxLKpMJmBgQagKBsNcC2Qw3R6yWh6s9bo9ZgnV6oIqBTL1qDDCsTk00x6zy0nS9qOoqm/o2AqindkK5bYBzTs29Nv71HeB8qRO9HtrMvSEobHDyzxqpI/mVYG6YnST0RkKVQoWoakgl2U4kn6kNavzrtsszDZPld18A+EWdDf1aHBDCmHAYyHRGc6865uXazWdyoXB5ikBi21FJOFMiRjXAUoa2HXnTv0WzG6aTZnUl7x9Z/4R4lYxwYe14p8RFgdvGpONTiT+jqTvJOcStC6KnWqaJUoEk5k3bqLtdiMgPHADEwQ0BqrarU3UR0TCs11AlgcDTrngvhnGuav6vyrJL6OWuJoXcjrTGAzangMh3k6QnQGhZdklCVL5u5AvO1PWb3AbB4z2hxlgdpvSSWeS85zgoy2k7FFdpNB2xBT/AEpaxdFK+ioevNHX+zLyI/ixHINGQMYnadt7z5zzZhqzGp3Dco4AUHZA8wUqW9DGkaDJWy2ZamjI5IUkElp1VxGIwqO2M0g9I1wtaSklS3CBFughcSBvrUHuhovcqzu2JlPjKNSwuveJN5U6SlCaHh1VOUN2oNIlzHmsisqTGALCpa5SWFoKVJLYce7ObVpy0zK358w1zF4gdwoIhKpOQrD2HErXDP5RuWgJvSSJbg5qPPdGOWTRExyBSnPPujQNSbDOlTL85yqIhRFvAhrxFWoGIGCjnhxjHLpriuZB85Q2R5r+USlmKd3u90dovHvEc2zIPnzlHQ0NDz57o6T8PnX4x0YPgx2sRr3ke/jChMiKf7Y8DDV6vDzh54wscac9n5xAsGE0Ecoc48GgOkdvnjCbuwCFXuMcJFKU+Xn5QDLyweXH4xBtWipTgkqByyzgmRx8+axzztgYqNs1Tlvim3znFb0hqk61oK90aiRj5yhJTz55xdTGJ2rQsxdhgfMszDMRtlqsIP7MHiDTmfO6A9r1dRyepjF1MZKMIMqpmoAACTdUVNKEVK47zW73b4s1t1P2geeyAFo0c9nrVaocCNhEXUQ9GyG6QyyCGuWgEHOvQkgHtAiDKcihXA+cOO3CLTo5hMtEqa0wEIACTg5XEG99Y0NK8MtsCXRLOTdZZkwZEYhT9bEZjYMeeYIM6QNGu0AuKFIGV7EuByZmHZDuq8u/bbMpyM+XXkGBPugW7Q5o+2NJmpNSl5GDCuIqN8UfR4KnKO1jIbL6TrSvryZTcr6n+ojwggvpUFCGsh7JvzTCINHew2eaQ0+TLm0y6SWrUHC8DSCdjsljliqSZEvistE8QBGWv6UpVw0s8y/TAFlu14kY07Iomk9YJ0+Z0syYxYerTAJwQD1R79tYsMj6Ya2StsxPxD5xHm6Us4znSx/EI+bP8dnfvO9QffCW01O+v/IvyjSY3/SGtVjlgk2iV+ME9gGJ7BGWa86e+mUKTE6JKlUvAMTT1iuYNKgDYCd5imTNJTTm5hhrQ5zY98RUmVo+Y4vAYHbyNPhHjo4jNlHNhEMud8JiaJbWZBnNXsqfcI4FlDax7AB8T4RFj0QGrCLJXrEjs+JNPCLBZ5NjZaA9t5lP8tBFFhaMRlXsgsq8jV2WcZc5hzowHdQ98Ll6NtSYy5yt2sD3EEeMVaxWyYMiYsVg0vM2mvP5xnK1sTJekbZL9aUxHDrdvUJ90Sk1soKMpBGYIOHeIfsukA1ARSu3GlYIA8fGIo3Wvnnl2fGOMvn5xzGPRpkkrs8+fzhQ28jln5yMd8+fCOXYDqzOQ/tnh5xj147T54+Ecbj5pCTXz4+efaD5fH+8dDcoYqN/j2087o4H8O6IqTXPGO1/t2+MRw+Offz/ADh4Gvb57IBRjl7z58846E89n9oSw8+eXjEHTHGXd44x6vnzsjtYBLA7tvu8+cI6V7/d5+EdveflHoimilfOXfDFpsSTAQyhuYziS4PP8t0NS5lTQkLxIJpxwxw4DblFRUdJ6hSmxlOZZPsnrJ3HEbdsVi3amWtMgjj7J+BApG2ydDFlqs9GPBcM8ia1BiFa9Gzkzl1G0oag78KV8I19T4wh9CzxmhhptGzBsjankIx6y1O0nPjjwiJP0JLbZDUxjhsj7oQ0giNWtWq42U/vl2wGteq5FcIumM/KGORbJ2rbDYYhzdAMNkXUV6PQZbQjcYbOhX8iAFR6Cf8Ag0yFroR+PdEAqkeCndFhs+hDlQ1OUS5ehD5/OAqolncYcSzMYtg0Qw9kHthaaOU5qcNoy74LitytGkxOk6K4QeTRIzVfA18IeTRzDYfGJpgXJ0cImy7H9nz3QSlaOYbR5/KJ9nsyjMV5DLl3RNXESxWRqgkcf7dsEuj84w7Lk4nE1O84dm6FFTuHhE1p/9k=",
    },
 

  ];
  const reviews = [
    {
      author: "John D.",
      content:
        "Great service! The car was clean and the driver was professional.",
      rating: 5,
    },
    {
      author: "Sarah M.",
      content: "Easy booking process and competitive prices. Will use again!",
      rating: 4,
    },
    {
      author: "Mike R.",
      content: "Excellent experience from start to finish. Highly recommended!",
      rating: 5,
    },
    {
      author: "John D.",
      content:
        "Great service! The car was clean and the driver was professional.",
      rating: 5,
    },
    {
      author: "Sarah M.",
      content: "Easy booking process and competitive prices. Will use again!",
      rating: 4,
    },
    {
      author: "Mike R.",
      content: "Excellent experience from start to finish. Highly recommended!",
      rating: 5,
    },
  ];
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === popularRoutes.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? popularRoutes.length - 1 : prev - 1));
  };


  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-900 fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex ">
          <a href="#" className="text-white flex items-center bold">
              Go Keral
            </a>
          <img src="../../../public/gokeral.png" alt="Go Keral Logo" className="h-12" />
          </div>
       
         
          <nav className="hidden md:flex space-x-4">
            <a href="#" className="text-white flex items-center">
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Home
            </a>
            <a href="#" className="text-white flex items-center">
              <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
              About Us
            </a>
            <a href="#" className="text-white flex items-center">
              <FontAwesomeIcon icon={faDollar} className="mr-2" />
              Pricing
            </a>
            <a href="#" className="text-white flex items-center">
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              Contact
            </a>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center">
              <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
              Login
            </button>
            <button className="bg-white text-blue-900 px-4 py-2 rounded-full flex items-center">
              <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-[5%] px-4 sm:px-6 lg:px-8 ">
        {/* Hero Section */}
        <div className="relative h-96 mb-8 bg-cover bg-center" style={{backgroundImage: "url(https://images.unsplash.com/photo-1663597675745-96a3f784369e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)"}}>
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="relative z-10 h-full flex flex-col justify-center px-8">
            <h1 className="text-5xl font-bold text-white mb-4">Book Your Ride Today</h1>
            <p className="text-xl text-white max-w-lg">Experience comfort and convenience with our premium vehicle booking service</p>
            <a href="/maps"><button  className="bg-white opacity-2 text-gray-800 px-6 py-2 rounded-lg font-bold w-[30%] mt-5">Book Now</button></a>
          </div>
        </div>

        {/* Search Form */}
        {/* <div className="bg-blue-900 rounded-lg shadow-lg p-6 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url(bgCar.png)"}}></div>
          <h2 className="text-2xl font-bold text-white text-center mb-4 relative z-10">Find Your Perfect Ride</h2>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            <input type="text" placeholder="Pickup Location" className="w-full p-3 rounded-lg" />
            <input type="text" placeholder="Drop-off Location" className="w-full p-3 rounded-lg" />
            <input type="text" placeholder="Vehicle Type" className="w-full p-3 rounded-lg" />
            <div className="md:col-span-2">
              <input type="text" placeholder="Date Range" className="w-full p-3 rounded-lg" />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faCar} className="mr-2" />
              Search Vehicles
            </button>
          </form>
        </div> */}

        {/* Popular Routes */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Destinations</h2>
          <div className="relative h-[600px] w-full">
            <div className="relative h-full overflow-hidden rounded-2xl">
              {popularRoutes.map((route, index) => (
                <div
                  key={index}
                  className={`absolute w-full h-full transition-all duration-700 ease-in-out transform ${
                    index === currentSlide ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                  }`}
                >
                  <div className="relative h-full w-full">
                    <img
                      src={route.image}
                      alt={route.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent">
                      <div className="h-full flex flex-col justify-center p-12 max-w-2xl">
                        <h3 className="text-4xl font-bold text-white mb-4">{route.name}</h3>
                        <p className="text-lg text-white/90 mb-6">{route.description}</p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white w-fit px-6 py-3 rounded-lg font-bold transition-all">
                          Explore Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

               {/* Carousel Controls */}
               <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-md text-white p-4 rounded-full transition-all"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-2xl" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-md text-white p-4 rounded-full transition-all"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-2xl" />
            </button>

            {/* Carousel Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
              {popularRoutes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Vehicle Types Section */}
        <div className="mb-16 bg-gray-50 py-12 rounded-2xl">
          <div className="max-w-7xl mx-auto px-2">
            <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Perfect Ride</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicleTypes.map((vehicle, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all">
                  <div className="relative h-48">
                    <img src={vehicle.image} alt={vehicle.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full">
                      {vehicle.price}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{vehicle.title}</h3>
                    <p className="text-gray-600 mb-4">{vehicle.description}</p>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-all">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

    
        {/* Special Offer */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Special Offer</h2>
              <p className="text-white mb-4 md:mb-0">Get 15% off on your first booking! Don't miss this limited time offer.</p>
            </div>
            <button className="bg-white text-blue-500 px-6 py-2 rounded-lg font-bold">Claim</button>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-6 transform hover:scale-105 transition duration-300">
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon icon={faUser} className="text-blue-500 text-3xl mr-4" />
                  <div>
                    <h3 className="font-bold">{review.author}</h3>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="italic text-gray-600">{review.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="text-white hover:text-gray-300">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
          <p className="text-center mb-2">Contact: info@vehiclebooking.com | Phone: (123) 456-7890</p>
          <p className="text-center">© 2024 VehicleBooking. All rights reserved.</p>
        </div>
      </footer>

      {/* Chat Bot */}
      <button className="fixed right-6 bottom-6 bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
        <FontAwesomeIcon icon={faComment} className="text-2xl" />
      </button>
    </div>
  );
};

export default HomePage;