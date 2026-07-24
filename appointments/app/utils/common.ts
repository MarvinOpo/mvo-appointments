import moment from "moment";

export const getAge = (birthDate: string | Date) =>
    moment().diff(birthDate, "years");

export const getFullName = (user: any) => {
    return [user.fname, user.mname, user.lname, user.ext_name]
        .filter(Boolean)
        .join(" ")
        .trim();
};
