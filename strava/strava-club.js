const getMemberInfo = async (page, memberClubUrl) => {
    await page.goto(memberClubUrl);
    return await page.evaluate(() => {
        let members = document.querySelectorAll(
            "ul.list-athletes div.text-headline a"
        );
        members = [...members];
        let memberInfos = [];
        members.forEach((member) => {
            let stravaIdIndex = member.href.lastIndexOf("/");
            memberInfos.push({
                name: member.textContent,
                profileUrl: member.href,
                stravaId: member.href.slice(stravaIdIndex + 1),
            });
        });
        memberInfos.forEach((memberInfo) => {
            console.log(memberInfo);
        });
        return memberInfos;
    });
};
module.exports = {
    getMemberInfo,
};
