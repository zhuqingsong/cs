import { asyncRoutes, constantRoutes } from '@/router'
// import routes from 'mock/role/routes'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}


const filterRoutesPath = (paths) => {
   let formatPath =[];
   if(paths.length> 0) {
      paths.forEach(route=>{
          const parentPath = asyncRoutes.filter(item=> route.pid == 0 && (item.path == route.path));
          console.log(parentPath);
          if(parentPath.length>0){
            formatPath.push(parentPath[0]);
          }
      })
      formatPath.forEach(route => {
        if(route.children && route.children.length > 0) {
           route.children.forEach((child,index)=>{
              const childpath = paths.filter(childitem=> childitem.pid !=0 && (child.path == childitem.path))
              if(childpath.length ==0 ){
                route.children.splice(index, 1);
              }
           });
        }
      })
   }
   return formatPath 
}

const actions = {
  generateRoutes({ commit }, paths) {


    console.log(paths, 'pppppppppp');
    return new Promise(resolve => {
      let accessedRoutes = [];
      if(paths.length>0){

        console.log("1212121212121");
        const routerPaths = filterRoutesPath(paths);

        console.log(routerPaths, 'fffffffff');
        commit('SET_ROUTES', routerPaths)
        resolve(routerPaths)
      }else{
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }
      // let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, paths)
      // }
     //  commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
