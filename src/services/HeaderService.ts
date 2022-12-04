export default function generateHeaders(onlyAuth = false) {
  let user = localStorage.getItem('user');
  if (user) {
    if(onlyAuth) {return { Authorization: 'Bearer ' + user } as HeadersInit;}
    return { Authorization: 'Bearer ' + user, 'Content-Type': 'application/json' } as HeadersInit;
  } else {
    return { 'Content-Type': 'application/json' } as HeadersInit;
  }
}
