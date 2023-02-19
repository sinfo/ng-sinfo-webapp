export class CreateAchievement {

  constructor(
    /* Id of the achievement (it's NOT the one from the database) */
    public id: string,
    /* Name of the achievement */
    public name: string,
    /* Event the achievement is associated to. Example: 30 for SINFO 30 */
    public event: string,
    /* Id of a session associated to this achievement */
    public session: string,
    /* Amount of points associated to the achievement */
    public value: number,
    public validity: {
      /* Date when the achievement starts being available for grabs */
      from: Date,
      /* Date when the achievement starts stops being available for grabs */
      to: Date,
    },
    /* Kind of achievement (cv, for example) */
    public kind: string,
    /* Description of the achievement */
    public description?: string,
    /* Category of the achievement */
    public category?: string,
    /* Instructions on how to get the achievement */
    public instructions?: string,
    /* Image of the achievement */
    public img?: File,
  ) { }
}
