import{Page,expect}from'@playwright/test';
export class ProcessAndTasksPage{
    page:Page;
    constructor(page:Page){
        this.page=page;
    }
    async open(){
        await this.page.goto('https://tmandev.thy.com/gos-tman/dyn/tpl/index.html');
        await this.page.getByRole('button',{name:'Master Data'}).click;
        await this.page.getByRole('menuitem',{name:'Process & Task'}).click;
        await this.page.getByText('Process And Task Configuration').click();
    }
async expectPageOpened(){
        const panel=this.page.getByRole('tabpanel',{name:'Process And Task Configuration'});
        await expect(panel.getByText('Process And Task Configuration')).toBeVisible({timeout:30_000});
    }
async expectDataLoaded(){
        const panel=this.page.getByRole('tabpanel',{name:'Process And Task Configuration'});
        await expect(panel.getByText('Displaying')).toBeVisible({timeout:30_000});  
    }
}
