export function sortAlphabet(str: String) {
  return [...str.replace(/[^a-z]+/gi, "")].sort((a, b) => a.localeCompare(b)).join("");
}

export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("fa", { year: "numeric", month: "short", day: "numeric" });
}

export function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString("fa", { hour: "numeric", minute: "numeric" });
}

export function chunkArray(data: Array<any>, size: number) {
  if (!size) {
    return [data];
  }

  let r = [];
  for (let i: number = 0; i < data.length; i += size) {
    r.push(data.slice(i, i + size));
  }
  return r;
}

export function pluralize(count: number, noun: string, suffix = "s") {
  return `${count} ${noun}${count !== 1 ? suffix : ""}`;
}

export const BREAK_POINTS: Record<string, string> = {
  "(min-width: 1200px)": "xl",
  "(min-width: 992px) and (max-width: 1199.98px)": "lg",
  "(min-width: 768px) and (max-width: 991.98px)": "md",
  "(min-width: 576px) and (max-width: 767.98px)": "sm",
  "(max-width: 575.98px)": "xs",
};

export function getBreakPoint() {
  for (let media in BREAK_POINTS) {
    if (window.matchMedia(media).matches) {
      return BREAK_POINTS[media];
    }
  }

  return null;
}

export function isPortrait() {
  return window.innerHeight > window.innerWidth;
}

export function isLandscape() {
  return window.orientation === 90 || window.orientation === -90;
}

export const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
  },
  any: function () {
    return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
  },
};

//@ts-ignore
function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

//@ts-ignore
export function formatDateTime(date) {
  return (
    [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join("-") +
    " " +
    [padTo2Digits(date.getHours()), padTo2Digits(date.getMinutes()), padTo2Digits(date.getSeconds())].join(":")
  );
}

// restrict to number
export function restrictToNumber(val: string){
  return val.replace(/\D/g, '');
}

export function handleMapClick (lnglat:any, token:string) {
  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lnglat.lng},${lnglat.lat}.json?access_token=${token}`)
  .then(response => response.json())
  .then(data => {
    const address = data.features[0].place_name;
    console.log(address)
  })
  .catch(error => {
    console.error('Error fetching address:', error);
  });
}


export function getSiteUrl (adminSide: boolean) {
  return location.protocol + '//' + location.host + (adminSide ? '/admin' : '')
}
