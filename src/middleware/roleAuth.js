export const isTeacher = (req, res, next) => {
  try {
    if (req.user.role === 'teacher' || req.user.role === 'admin') return next();
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return res.redirect('/');
  }
};

export const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== 'admin') return res.redirect('/');
    return next();
  } catch (error) {
    console.error(error);
    return res.redirect('/');
  }
};
