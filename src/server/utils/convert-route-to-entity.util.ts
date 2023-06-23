const mapping: Record<string, string> = {
  'course-files': 'course_file',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
