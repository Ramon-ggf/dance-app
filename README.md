# Dance App


## Endpoints table

Id | Method | Path | Description
---|--------|-------|-----------
1 | GET | / | Renderiza la página principal (index)
2 | GET | /signup | Rendenriza formulario de registro
3 | POST | /signup | Guarda en la DDBB el resgistro de un usuario
4 | GET | /login | Renderiza formulario de inicio de sesión
5 | POST | /login | Guarda en la DDBB la sesión de un usuario loggeado
6 | GET | /profile | Renderiza el perfil de un usuario loggeado
7 | GET | /profile/edit | Renderiza el formulario para editar el perfil 
8 | POST | /profile/edit/:user_id | Actualiza el perfil del usuario en la DDBB
9 | GET | /courses | Renderiza la lista de clases disponibles
10 | GET | /courses/new | Renderiza el formulario para crear una nueva clase
11 | POST | /courses/new | Guarda en la DDBB la clase creada
12 | GET | /courses/edit/:course_id | Renderiza el formulario para editar una clase
13 | POST | /courses/edit/:course_id | Actualiza en la DDBB la clase editada
14 | POST | /courses/cancel/:course_id | Cambia el estado del campo 'active' de la clase a inactivo
15 | GET | /meetup | Renderiza la lista de encuentros disponibles
16 | GET | /meetup/new | Renderiza el formulario para crear un nuevo encuetro
17 | POST | /meetup/new | Guarda en la DDBB el nuevo encuentro creado
18 | GET | /meetup/edit/:meetup_id | Renderiza el formulario para editar un encuentro
19 | POST | /meetup/edit/:meetup_id | Actualiza en la DDBB el cuentro editado
20 | POST | /cancel/:meetup_id | Cambia el estado del campo 'active' del encuentro a inactivo
21 | POST | /attend/:meetup_id | Añade la asistencia de los usuarios que quieren acudir al encuentro


