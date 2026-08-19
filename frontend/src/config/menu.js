export const menu_items={
    student:[
        {
            title:'Dashboard',
            icon:'fa-table-columns',
            route:'/student/dashboard'

        },
        {
            title:'New Order',
            icon:'fa-print',
            route:'/student/new-order'
        },
        {
            title:'My Orders',
            icon:'fa-file-lines',
            route:'/student/orders'
        },
        {
            title:'Payments',
            icon:'fa-credit-card',
            route:'/student/payments'
        },
        {
            title: "Profile",
            icon: "fa-user",
            route: "/student/profile"
        }
    ],

    staff:[

        {
            title: "Dashboard",
            icon: "fa-table-columns",
            route: "/staff/dashboard"
        },
        {
            title: "Pending Orders",
            icon: "fa-clock",
            route: "/staff/orders"
        },
        {
            title: "Print Queue",
            icon: "fa-print",
            route: "/staff/queue"
        },
        {
            title: "Completed",
            icon: "fa-circle-check",
            route: "/staff/completed"
        }
    ],
    admin:[
        {
            title: "Dashboard",
            icon: "fa-table-columns",
            route: "/admin/dashboard"
        },
        {
            title: "Users",
            icon: "fa-users",
            route: "/admin/users"
        },
        {
            title: "Orders",
            icon: "fa-print",
            route: "/admin/orders"
        },
        {
            title: "Pricing",
            icon: "fa-indian-rupee-sign",
            route: "/admin/pricing"
        },
        {
            title: "Reports",
            icon: "fa-chart-line",
            route: "/admin/reports"
        }

    ]
}